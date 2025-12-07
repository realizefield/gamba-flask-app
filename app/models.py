import sqlite3
import os

# === DBのパス設定 ===
BASE_DIR = os.path.dirname(os.path.dirname(__file__))  # GAMBAフォルダ
DB_PATH = os.path.join(BASE_DIR, "gamba.db")


def get_connection():
    """DB接続（なければ作成）"""
    conn = sqlite3.connect(DB_PATH)
    return conn


def init_db():
    """gamba.db を初期化して必要なテーブルを作成する"""

    conn = get_connection()
    cur = conn.cursor()

    # === 学習単元テーブル（MA01〜MA09） ===
    cur.execute("""
        CREATE TABLE IF NOT EXISTS units (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            code TEXT NOT NULL UNIQUE,
            title TEXT NOT NULL
        )
    """)

    # === 生徒の進捗テーブル ===
    cur.execute("""
        CREATE TABLE IF NOT EXISTS student_progress (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            student_id     INTEGER NOT NULL,
            student_name   TEXT NOT NULL,
            last_unit_code TEXT NOT NULL,
            last_unit_name TEXT NOT NULL,
            last_action    TEXT NOT NULL,
            last_date      TEXT NOT NULL
        )
    """)

    # === 単元データ（初期登録） ===
    units = [
        ("MA01", "分数の性質"),
        ("MA02", "約分"),
        ("MA03", "約分(2)"),
        ("MA04", "分数の和差（同じ分母）"),
        ("MA05", "通分して計算"),
        ("MA06", "1＋分数・1−分数"),
        ("MA07", "2＋分数・3−分数"),
        ("MA08", "帯分数→仮分数"),
        ("MA09", "仮分数→帯分数"),
    ]

    # 既に入っている場合はスキップ（重複回避）
    cur.executemany("""
        INSERT OR IGNORE INTO units (code, title)
        VALUES (?, ?)
    """, units)

    conn.commit()
    conn.close()
    print("✔ gamba.db の初期化が完了しました！")


# === 単元一覧取得 ===
def get_all_units():
    conn = get_connection()
    conn.row_factory = sqlite3.Row
    cur = conn.cursor()

    cur.execute("SELECT code, title FROM units ORDER BY code")
    rows = cur.fetchall()
    conn.close()
    return rows


# === 生徒進捗取得（A案用：仮固定） ===
def get_student_progress(student_id):
    conn = get_connection()
    conn.row_factory = sqlite3.Row
    cur = conn.cursor()

    cur.execute("""
        SELECT student_name, last_unit_code, last_unit_name, last_action, last_date
        FROM student_progress
        WHERE student_id = ?
        ORDER BY id DESC
        LIMIT 1
    """, (student_id,))

    row = cur.fetchone()
    conn.close()
    return row


# このファイルが直接実行された場合だけ DB 初期化
if __name__ == "__main__":
    init_db()
def get_all_units():
    """単元一覧を DB から取得"""
    conn = get_connection()
    cur = conn.cursor()
    cur.execute("SELECT code, title FROM units ORDER BY id")
    rows = cur.fetchall()
    conn.close()

    return [{"code": r[0], "title": r[1]} for r in rows]


def get_student_progress(student_id=1):
    """指定した生徒の最新の進捗を1件だけ取得"""
    conn = get_connection()
    cur = conn.cursor()
    cur.execute("""
        SELECT student_id, student_name, last_unit_code,
               last_unit_name, last_action, last_date
        FROM student_progress
        WHERE student_id = ?
        ORDER BY id DESC
        LIMIT 1
    """, (student_id,))
    row = cur.fetchone()
    conn.close()

    if row is None:
        return None

    return {
        "student_id": row[0],
        "student_name": row[1],
        "last_unit_code": row[2],
        "last_unit_name": row[3],
        "last_action": row[4],
        "last_date": row[5],
    }
