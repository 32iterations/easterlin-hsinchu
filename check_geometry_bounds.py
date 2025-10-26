"""
檢查建築模型的幾何邊界，找出超出外牆的房間
"""

import sys
import io

if sys.platform == 'win32':
    sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8', errors='replace')
    sys.stderr = io.TextIOWrapper(sys.stderr.buffer, encoding='utf-8', errors='replace')

SCALE = 0.2
W = 32.0 * SCALE  # 6.4
D = 20.0 * SCALE  # 4.0
wall_t = 0.06

# 外牆邊界（內側）
OUTER_BOUNDS = {
    'x_min': -W/2 + wall_t,  # 左牆內側
    'x_max': W/2 - wall_t,   # 右牆內側
    'z_min': -D/2 + wall_t,  # 前牆內側
    'z_max': D/2 - wall_t,   # 後牆內側
}

ROOM_DATA = {
    'B1': [
        {'name': '停車場', 'x': 0, 'z': 0.6, 'w': 5.6, 'd': 2.0, 'type': 'facility'},
        {'name': '機房區', 'x': 0, 'z': -1.7, 'w': 5.6, 'd': 0.6, 'type': 'technical'},
    ],
    '1F': [
        {'name': '失智症專區', 'x': -1.8, 'z': -0.4, 'w': 2.4, 'd': 2.6, 'type': 'healthcare'},
        {'name': '日照活動區', 'x': 1.4, 'z': -0.6, 'w': 2.4, 'd': 2.8, 'type': 'healthcare'},
        {'name': '共享餐廳', 'x': 0, 'z': 1.6, 'w': 3.6, 'd': 0.8, 'type': 'dining'},
    ],
    '2F': [
        {'name': '0-2歲嬰兒教室', 'x': -1.6, 'z': 0.8, 'w': 2.4, 'd': 2.0, 'type': 'healthcare'},
        {'name': '2-3歲幼兒教室', 'x': 1.6, 'z': 0.8, 'w': 2.4, 'd': 1.8, 'type': 'activity'},
        {'name': '親子共讀區', 'x': -1.6, 'z': -0.8, 'w': 2.0, 'd': 1.2, 'type': 'education'},
    ],
    '3F': [
        {'name': '棋牌活動室', 'x': -2.2, 'z': 0.6, 'w': 2.0, 'd': 1.4, 'type': 'activity'},
        {'name': '手工藝活動室', 'x': -0.2, 'z': 0.6, 'w': 2.0, 'd': 1.4, 'type': 'activity'},
        {'name': '跨代互動室', 'x': 0, 'z': -0.6, 'w': 2.2, 'd': 0.9, 'type': 'education'},
    ],
    '4F': [
        {'name': 'STEM教室', 'x': -2.0, 'z': 0.9, 'w': 1.8, 'd': 1.0, 'type': 'education'},
        {'name': 'VR投影區', 'x': 1.8, 'z': 0.4, 'w': 1.8, 'd': 0.8, 'type': 'activity'},
        {'name': '青少年交誼廳', 'x': 0, 'z': -0.4, 'w': 2.2, 'd': 0.7, 'type': 'activity'},
    ],
    '5F': [
        {'name': '大會堂', 'x': 0, 'z': 0.4, 'w': 5.2, 'd': 2.4, 'type': 'facility'},
        {'name': '議事室', 'x': 2.4, 'z': -1.7, 'w': 1.6, 'd': 0.6, 'type': 'administrative'},
    ],
    '6F': [
        {'name': '企業展示廳', 'x': 0, 'z': 0.4, 'w': 4.8, 'd': 2.0, 'type': 'facility'},
        {'name': '業師辦公室', 'x': -1.6, 'z': -1.6, 'w': 2.4, 'd': 1.2, 'type': 'administrative'},
    ],
    '7F': [
        {'name': '屋頂農場', 'x': -1.4, 'z': -0.4, 'w': 2.2, 'd': 1.8, 'type': 'facility'},
        {'name': '太陽能區', 'x': 1.4, 'z': -0.4, 'w': 2.2, 'd': 1.8, 'type': 'technical'},
        {'name': '露台區', 'x': 0, 'z': 1.5, 'w': 2.8, 'd': 1.0, 'type': 'activity'},
    ],
}

print("=" * 80)
print("🔍 建築幾何邊界檢查")
print("=" * 80)

print(f"\n📐 建築尺寸:")
print(f"   寬度 (W): {W:.2f} 單位")
print(f"   深度 (D): {D:.2f} 單位")
print(f"   外牆厚度: {wall_t:.3f} 單位")

print(f"\n🏢 外牆邊界（內側）:")
print(f"   X: [{OUTER_BOUNDS['x_min']:.3f}, {OUTER_BOUNDS['x_max']:.3f}]")
print(f"   Z: [{OUTER_BOUNDS['z_min']:.3f}, {OUTER_BOUNDS['z_max']:.3f}]")

violations = []
total_rooms = 0

for floor_name, rooms in ROOM_DATA.items():
    for room in rooms:
        total_rooms += 1
        x, z, w, d = room['x'], room['z'], room['w'], room['d']

        # 計算房間邊界
        room_x_min = x - w/2
        room_x_max = x + w/2
        room_z_min = z - d/2
        room_z_max = z + d/2

        # 檢查是否超出外牆
        violations_this_room = []

        if room_x_min < OUTER_BOUNDS['x_min']:
            violations_this_room.append(f"左邊超出 {OUTER_BOUNDS['x_min'] - room_x_min:.3f}")
        if room_x_max > OUTER_BOUNDS['x_max']:
            violations_this_room.append(f"右邊超出 {room_x_max - OUTER_BOUNDS['x_max']:.3f}")
        if room_z_min < OUTER_BOUNDS['z_min']:
            violations_this_room.append(f"前邊超出 {OUTER_BOUNDS['z_min'] - room_z_min:.3f}")
        if room_z_max > OUTER_BOUNDS['z_max']:
            violations_this_room.append(f"後邊超出 {room_z_max - OUTER_BOUNDS['z_max']:.3f}")

        if violations_this_room:
            violations.append({
                'floor': floor_name,
                'room': room['name'],
                'bounds': f"X:[{room_x_min:.2f}, {room_x_max:.2f}] Z:[{room_z_min:.2f}, {room_z_max:.2f}]",
                'violations': violations_this_room
            })

print(f"\n{'='*80}")
print(f"📊 檢查結果")
print(f"{'='*80}")
print(f"總房間數: {total_rooms}")
print(f"超出外牆的房間數: {len(violations)}")

if violations:
    print(f"\n❌ 發現 {len(violations)} 個房間超出外牆範圍（會導致 Z-Fighting 閃爍）:\n")
    for v in violations:
        print(f"   {v['floor']} - {v['room']}")
        print(f"      位置: {v['bounds']}")
        for violation in v['violations']:
            print(f"      ⚠️  {violation}")
        print()
else:
    print("\n✅ 所有房間都在外牆範圍內！")

print("=" * 80)
