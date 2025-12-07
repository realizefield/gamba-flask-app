from flask import (
    Flask, render_template, request, redirect,
    url_for, session, flash
)
import os
import csv
import json
import math
from functools import wraps
from flask_sqlalchemy import SQLAlchemy
from werkzeug.security import generate_password_hash, check_password_hash
from sqlalchemy import func

# ============================
# Flask 初期設定
# ============================
app = Flask(__name__)

BASE_DIR = os.path.abspath(os.path.dirname(__file__))

app.config["SECRET_KEY"] = "change-this-secret-key"
app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///" + os.path.join(BASE_DIR, "gamba.db")
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False

db = SQLAlchemy(app)


# ============================
# モデル定義
# ============================
class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password_hash = db.Column(db.String(255), nullable=False)
    name = db.Column(db.String(50), nullable=False)

    def set_password(self, pw: str):
        self.password_hash = generate_password_hash(pw)

    def check_password(self, pw: str) -> bool:
        return check_password_hash(self.password_hash, pw)


class Subject(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(50), nullable=False)


class Unit(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    subject_id = db.Column(db.Integer, db.ForeignKey("subject.id"), nullable=False)
    title = db.Column(db.String(100), nullable=False)
    order = db.Column(db.Integer, nullable=False, default=1)

    subject = db.relationship("Subject", backref=db.backref("units", lazy=True))


class Question(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    unit_id = db.Column(db.Integer, db.ForeignKey("unit.id"), nullable=False)
    text = db.Column(db.Text, nullable=False)
    correct_answer = db.Column(db.String(255), nullable=False)
    explanation = db.Column(db.Text, nullable=True)

    unit = db.relationship("Unit", backref=db.backref("questions", lazy=True))


class UserProgress(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey("user.id"), nullable=False)
    unit_id = db.Column(db.Integer, db.ForeignKey("unit.id"), nullable=False)
    last_score = db.Column(db.Float, nullable=True)
    status = db.Column(db.String(20), nullable=False, default="未学習")  # 未学習 / 学習中 / 修了

    user = db.relationship("User", backref=db.backref("progress", lazy=True))
    unit = db.relationship("Unit", backref=db.backref("user_progress", lazy=True))


# ============================
# 初期データ投入
# ============================
def init_data():
    """最初の1回だけ科目とテストユーザーを作成"""
    db.create_all()

    if Subject.query.first():
        return

    subjects = [
        Subject(name="英語"),
        Subject(name="数学"),
        Subject(name="生物基礎"),
        Subject(name="科学と人間生活"),
        Subject(name="歴史総合"),
    ]
    db.session.add_all(subjects)
    db.session.commit()

    user = User(email="test@example.com", name="テスト生", password_hash="")
    user.set_password("test1234")
    db.session.add(user)
    db.session.commit()

    print("初期データを作成しました。")


# ============================
# 認証ヘルパー
# ============================
def login_required(view):
    @wraps(view)
    def wrapper(*args, **kwargs):
        if "user_id" not in session:
            flash("ログインしてください。", "warning")
            return redirect(url_for("login"))
        return view(*args, **kwargs)
    return wrapper


def get_current_user():
    if "user_id" in session:
        return User.query.get(session["user_id"])
    return None


# ============================
# CSV から単元を取り込む（必要なら使用）
# ============================
def _import_units_from_csv(subject_name: str, csv_filename: str):
    """data/ 以下のCSVから Unit と Question をまとめて登録"""
    subject = Subject.query.filter_by(name=subject_name).first()
    if not subject:
        return f"科目 '{subject_name}' が見つかりません。/init を先に実行してください。"

    csv_path = os.path.join(BASE_DIR, "data", csv_filename)
    if not os.path.exists(csv_path):
        return f"CSV ファイルが見つかりません: {csv_path}"

    existing_titles = {
        u.title for u in Unit.query.filter_by(subject_id=subject.id).all()
    }

    max_order = db.session.query(func.max(Unit.order)).filter_by(subject_id=subject.id).scalar()
    if max_order is None:
        max_order = 0

    new_count = 0

    with open(csv_path, encoding="utf-8-sig") as f:
        reader = csv.reader(f)
        rows = list(reader)

    titles = []

    # 1列目〜3列目のパターン
    for row in rows:
        if len(row) >= 3:
            code, cat, topic = row[0], row[1], row[2]
            if code and cat and topic:
                title = f"{code} {cat} {topic}".strip()
                titles.append(title)

    # 5列目〜7列目のパターン
    for row in rows:
        if len(row) >= 7:
            code, cat, topic = row[4], row[5], row[6]
            if code and cat and topic:
                title = f"{code} {cat} {topic}".strip()
                titles.append(title)

    for title in titles:
        if title in existing_titles:
            continue

        max_order += 1
        unit = Unit(subject_id=subject.id, title=title, order=max_order)
        db.session.add(unit)
        db.session.flush()

        q_text = f"{title} の確認問題です。（本番の問題に差し替えてください）"
        q = Question(
            unit_id=unit.id,
            text=q_text,
            correct_answer="（後で設定）",
            explanation="この解説もあとで本物に差し替えてください。",
        )
        db.session.add(q)

        new_count += 1

    db.session.commit()
    return f"{subject_name} の単元を {new_count} 件追加しました。"


@app.route("/admin/import_math_units")
def import_math_units():
    msg = _import_units_from_csv("数学", "高認数学単元.csv")
    return msg


@app.route("/admin/import_english_units")
def import_english_units():
    msg = _import_units_from_csv("英語", "高認英語.csv")
    return msg


# ============================
# ルーティング
# ============================

@app.route("/init")
def init():
    init_data()
    return "初期化が完了しました。/login へどうぞ"


@app.route("/")
def index():
    if "user_id" in session:
        return redirect(url_for("dashboard"))
    return redirect(url_for("login"))


@app.route("/login", methods=["GET", "POST"])
def login():
    if request.method == "POST":
        email = request.form.get("email", "").strip()
        pw = request.form.get("password", "").strip()
        user = User.query.filter_by(email=email).first()

        if user and user.check_password(pw):
            session["user_id"] = user.id
            flash("ログインしました。", "success")
            return redirect(url_for("dashboard"))
        else:
            flash("メールまたはパスワードが違います。", "danger")

    return render_template("login.html")


@app.route("/logout")
def logout():
    session.clear()
    flash("ログアウトしました。", "info")
    return redirect(url_for("login"))


@app.route("/dashboard")
@login_required
def dashboard():
    user = get_current_user()
    subjects = Subject.query.order_by(Subject.id).all()
    return render_template("dashboard.html", user=user, subjects=subjects)


# 科目メニュー
@app.route("/subject/<int:subject_id>")
@login_required
def subject_menu(subject_id):
    user = get_current_user()
    subject = Subject.query.get_or_404(subject_id)
    return render_template("subject_menu.html", user=user, subject=subject)


# 「新しい単元から学習する」ボタン用（必要最小限）
@app.route("/subject/<int:subject_id>/new")
@login_required
def new_unit(subject_id):
    user = get_current_user()
    subject = Subject.query.get_or_404(subject_id)

    # その科目の最初の Unit を選ぶ（まだなければメニューに戻る）
    unit = (
        Unit.query
        .filter_by(subject_id=subject.id)
        .order_by(Unit.order)
        .first()
    )
    if not unit:
        flash("この科目の単元がまだ登録されていません。", "info")
        return redirect(url_for("subject_menu", subject_id=subject.id))

    # とりあえず JSON 型数学ページに飛ばす例（MA01 など）
    # 本番では unit.title から unit_code を切り出すなど調整
    return redirect(url_for("unit_page", unit_code="MA01", page="intro"))


# 「復習する」画面
@app.route("/subject/<int:subject_id>/review")
@login_required
def review(subject_id):
    user = get_current_user()
    subject = Subject.query.get_or_404(subject_id)

    reviewed_units = (
        Unit.query
        .join(UserProgress, UserProgress.unit_id == Unit.id)
        .filter(
            Unit.subject_id == subject.id,
            UserProgress.user_id == user.id,
            UserProgress.status != "未学習",
        )
        .order_by(Unit.order)
        .all()
    )

    return render_template("review.html", user=user, subject=subject, units=reviewed_units)


# 進度確認
@app.route("/subject/<int:subject_id>/progress")
@login_required
def progress(subject_id):
    user = get_current_user()
    subject = Subject.query.get_or_404(subject_id)

    units = Unit.query.filter_by(subject_id=subject.id).order_by(Unit.order).all()
    progress_dict = {
        p.unit_id: p for p in UserProgress.query.filter_by(user_id=user.id).all()
    }

    data = []
    for u in units:
        p = progress_dict.get(u.id)
        data.append({
            "unit": u,
            "status": p.status if p else "未学習",
            "score": p.last_score if p and p.last_score is not None else "-",
        })

    return render_template("progress.html", user=user, subject=subject, data=data)


# ============================
# JSON 単元ページ（数学教材）
# ============================
@app.route("/unit/<unit_code>/<page>")
@login_required
def unit_page(unit_code, page):
    json_path = f"data/math/{unit_code}/{unit_code}.json"

    try:
        with open(json_path, encoding="utf-8") as f:
            data = json.load(f)
    except FileNotFoundError:
        return f"JSON が見つかりません: {json_path}", 404

    if page not in data:
        return f"'{page}' ページは JSON に存在しません", 404

    return render_template(
        "unit_page.html",
        unit_code=unit_code,
        page=page,
        content=data[page]
    )


# ============================
# 英語クリック辞書デモ
# ============================
@app.route("/english_demo")
@login_required
def english_demo():
    return render_template("english_demo.html")


# ============================
# アプリ起動
# ============================
if __name__ == "__main__":
    # DB がまだなければ初期化
    if not os.path.exists(os.path.join(BASE_DIR, "gamba.db")):
        with app.app_context():
            init_data()

    app.run(debug=True)
