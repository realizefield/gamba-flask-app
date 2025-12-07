# app/routes.py

from flask import render_template, abort
from app import app
from app.models import get_all_units, get_student_progress  # 今はfuture用

# ---------------------------------------------------------
# 🔢 単元コード → 対応するテンプレート名
# ---------------------------------------------------------
UNIT_TEMPLATES = {
    # 数学 MA 系（汎用単元用。MA01は専用ページを使う）
    "MA01": "ma01.html",  # 一応入れておくが /math/MA01 は専用ルート
    "MA02": "ma02.html",
    "MA03": "ma03.html",
    "MA04": "ma04.html",
    "MA05": "ma05.html",
    "MA06": "ma06.html",
    "MA07": "ma07.html",
    "MA08": "ma08.html",
    "MA09": "ma09.html",
    # MA10 以降はここに追加

    # ★ 理科 SC 系
    "SC01": "science/reflection_quiz.html",
}


# ---------------------------------------------------------
# 🏠 数学GAMBA トップページ
#    URL: /
# ---------------------------------------------------------
@app.route("/")
def math_home():
    """
    数学GAMBAのトップページ。
    単元一覧を math_home.html に渡す。
    """
    student_id = 1  # 仮：ログイン実装後に置き換え

    units = get_all_units()

    # progress はまだ使わない（Noneで埋めておく）
    progress_map = {u.code: None for u in units}

    return render_template(
        "math_home.html",
        units=units,
        progress_map=progress_map,
        student_id=student_id,
    )


# ---------------------------------------------------------
# 📘 数学：汎用 各単元ページ
#    例: /math/MA02 で ma02.html を表示
#    ※ MA01 は下の専用ルートを使う
# ---------------------------------------------------------
@app.route("/math/<unit_code>")
def math_unit(unit_code):
    """
    数学の単元コード (MA02 など) から対応するテンプレートを表示する。
    MA01 だけは専用ルート（導入・例題・類題・確認）を使用。
    """
    code = unit_code.upper()

    # MA01 は専用ルートに任せる（404を避けるため一応ここでも拾えるようにしておく）
    if code == "MA01":
        return render_template("ma01.html", unit_code="MA01", progress=None)

    template_name = UNIT_TEMPLATES.get(code)
    if template_name is None:
        abort(404)

    progress = None  # 進度機能はあとで実装

    return render_template(
        template_name,
        unit_code=code,
        progress=progress,
    )


# ---------------------------------------------------------
# 📘 MA01 専用：導入 → 例題 → 類題 → 確認
#    URL:
#      /math/MA01           … 導入
#      /math/MA01/example   … 例題
#      /math/MA01/drill     … 類題
#      /math/MA01/check     … 確認問題
# ---------------------------------------------------------
@app.route("/math/MA01")
def ma01_intro():
    return render_template("ma01_intro.html", unit_code="MA01", progress=None)


@app.route("/math/MA01/example")
def ma01_example():
    return render_template("ma01_example.html", unit_code="MA01", progress=None)


@app.route("/math/MA01/drill")
def ma01_drill():
    return render_template("ma01_drill.html", unit_code="MA01", progress=None)


@app.route("/math/MA01/check")
def ma01_check():
    return render_template("ma01_check.html", unit_code="MA01", progress=None)


# ---------------------------------------------------------
# 🔬 理科：各単元ページ
#    例: /sc/SC01
# ---------------------------------------------------------
@app.route("/sc/<code>")
def science_unit_page(code):
    sc_code = code.upper()

    template_name = UNIT_TEMPLATES.get(sc_code)
    if template_name is None:
        abort(404)

    return render_template(
        template_name,
        unit_code=sc_code,
    )


# ---------------------------------------------------------
# 📖 英語：宮崎大学 長文①
# ---------------------------------------------------------
@app.route("/english_miyazaki01")
def english_miyazaki01():
    return render_template("english_miyazaki01.html")
