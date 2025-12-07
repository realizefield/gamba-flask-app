# app/routes.py

from flask import render_template, abort
from app import app
from app.models import get_all_units, get_student_progress

# ---------------------------------------------------------
# 🔢 単元コード → 対応するテンプレート名
# ---------------------------------------------------------
UNIT_TEMPLATES = {
    "MA01": "ma01.html",
    "MA02": "ma02.html",
    "MA03": "ma03.html",
    "MA04": "ma04.html",
    "MA05": "ma05.html",
    "MA06": "ma06.html",
    "MA07": "ma07.html",
    "MA08": "ma08.html",
    "MA09": "ma09.html",
    # MA10 以降はここに追加していけば良い
    # ★理科の単元 SC01 のマッピングを追加★
    "SC01": "science/reflection_quiz.html",
}
# ---------------------------------------------------------
# 📘 理科の各単元のページ 例： /sc/SC01
# ---------------------------------------------------------
@app.route("/sc/<code>")
def science_unit_page(code):
    """
    理科の単元コード (SC01など) に基づいてテンプレートを表示する。
    """
    code = code.upper()
    template_name = UNIT_TEMPLATES.get(code) # UNIT_TEMPLATES からファイル名を取得

    if not template_name:
        abort(404)

    # templates/science/reflection_quiz.html を読み込む
    return render_template(template_name, unit_code=code)

# ---------------------------------------------------------
# 🏠 数学GAMBA トップページ
# ---------------------------------------------------------
@app.route("/")
def math_home():
    student_id = 1  # 仮：太郎さん（ログイン実装後に置き換え）

    units = get_all_units()
    progress = get_student_progress(student_id)  # ない場合は None

    return render_template("index.html", units=units, progress=progress)


# ---------------------------------------------------------
# 📘 各単元のページ 例： /ma/MA01
# ---------------------------------------------------------
@app.route("/ma/<code>")
def unit_page(code):
    code = code.upper()
    template_name = UNIT_TEMPLATES.get(code)

    if not template_name:
        abort(404)

    return render_template(template_name, unit_code=code)

# -----------------------------
# 宮崎大学 長文①
# -----------------------------
@app.route("/english_miyazaki01")
def english_miyazaki01():
    return render_template("english_miyazaki01.html")
# app/routes.py に新規追加するコード
