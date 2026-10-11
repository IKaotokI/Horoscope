"""สร้างตารางวันขึ้น 1 ค่ำของทุกเดือนจันทรคติไทย ค.ศ. 1900–2100 จาก pythaidate (MIT)

CLAUDE.md: จันทรคติให้ใช้ไลบรารีเท่านั้น ห้ามคำนวณเอง → ฝั่ง JS ใช้ตารางที่สร้างล่วงหน้าจากสคริปต์นี้

การใช้งาน:
    pip download pythaidate==0.2.0 --no-deps -d /tmp/pyd
    unzip /tmp/pyd/pythaidate-0.2.0-py3-none-any.whl -d /tmp/pyd/src
    python3 -I scripts/gen_thai_lunar.py /tmp/pyd/src src/data/thai-lunar-months.json

ผลลัพธ์: {"firstJdn": N, "months": [[jdn - firstJdn, เดือน], ...]}
เดือน 1 = อ้าย, 2 = ยี่, ..., 12, และ 88 = เดือน 8 หลัง (อธิกมาส)
"""
import json
import sys

sys.path.insert(0, sys.argv[1])
from pythaidate import CsDate  # noqa: E402
from pythaidate.julianday import to_julianday  # noqa: E402

start = to_julianday(1900, 1, 1)
end = to_julianday(2100, 12, 31)
starts = []
prev = None
for jd in range(start - 40, end + 40):
    c = CsDate.fromjulianday(jd)
    m, d = c.month, c.day
    if prev is not None:
        pm, pd = prev
        if d == 1:
            assert pd in (29, 30), (jd, pm, pd, m, d)
        else:
            assert d == pd + 1, (jd, pm, pd, m, d)
    if d == 1:
        starts.append([jd, m])
    prev = (m, d)

base = starts[0][0]
out = {
    "source": "pythaidate 0.2.0 (MIT, Mark Hollow) CsDate.fromjulianday",
    "firstJdn": base,
    "months": [[s - base, m] for s, m in starts],
}
with open(sys.argv[2], "w") as f:
    json.dump(out, f, separators=(",", ":"))
print(len(starts), base)
