"""
赤土崎多功能館 GLB 模型生成器 - PowerPoint 專用版
使用 trimesh 生成 PowerPoint 完全兼容的 GLB 格式
"""

import sys
import io
import numpy as np
import trimesh

# Windows 編碼修正
if sys.platform == 'win32':
    sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8', errors='replace')
    sys.stderr = io.TextIOWrapper(sys.stderr.buffer, encoding='utf-8', errors='replace')

# 建築參數
SCALE = 0.2
W = 32.0 * SCALE
D = 20.0 * SCALE
H = 3.5 * SCALE

# 真實樓層顏色（灰色調）
FLOOR_COLORS = [
    [122, 122, 122, 255],  # B1 深灰
    [154, 154, 154, 255],  # 1F 灰
    [154, 154, 154, 255],  # 2F 灰
    [176, 176, 176, 255],  # 3F 淺灰
    [245, 245, 245, 255],  # 4F 極淺灰
    [245, 245, 245, 255],  # 5F 極淺灰
    [240, 240, 240, 255],  # 6F 灰白
    [232, 232, 232, 255],  # 7F 灰白
]

# 房間類型顏色（半透明）
ROOM_COLORS = {
    'healthcare': [0, 255, 136, 100],    # 醫療 - 青綠色（半透明）
    'activity': [0, 204, 255, 100],      # 活動 - 青藍色
    'dining': [255, 170, 0, 100],        # 餐飲 - 橙色
    'technical': [255, 0, 127, 80],      # 技術 - 紫紅色
    'education': [102, 153, 255, 100],   # 教育 - 藍色
    'facility': [153, 153, 178, 100],    # 設施 - 灰藍
    'administrative': [128, 128, 128, 100],  # 行政 - 灰
}

# 家具顏色
FURNITURE_COLORS = {
    'white': [255, 255, 255, 255],
    'brown': [139, 69, 19, 255],
    'darkbrown': [105, 105, 92, 255],
}

# 分隔牆顏色
PARTITION_COLOR = [211, 211, 211, 255]

# 房間數據
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

def create_box_mesh(center, size, color):
    """創建帶顏色的長方體 mesh"""
    box = trimesh.creation.box(size)
    box.apply_translation(center)

    # 設置顏色（RGBA）
    if len(color) == 3:
        color = list(color) + [255]
    box.visual.vertex_colors = color

    return box

def create_building_glb():
    """創建完整的建築 GLB 模型"""
    meshes = []

    print("🏗️  生成建築結構...")

    wall_t = 0.06

    # 為每層樓創建結構
    for floor_idx in range(8):
        y = floor_idx * H
        floor_color = FLOOR_COLORS[floor_idx]
        floor_name = ['B1','1F','2F','3F','4F','5F','6F','7F'][floor_idx]

        print(f"   {floor_name}: {['停車場','失智/日照','托嬰中心','跨代互動','STEM/VR','大會堂','企業展示','屋頂花園'][floor_idx]}")

        # 外牆（四分之一切開）
        # 右側牆
        meshes.append(create_box_mesh(
            [W/2 - wall_t/2, y + H/2, 0],
            [wall_t, H, D],
            floor_color
        ))

        # 後側牆
        meshes.append(create_box_mesh(
            [0, y + H/2, D/2 - wall_t/2],
            [W, H, wall_t],
            floor_color
        ))

        # 左側牆（後半部）
        meshes.append(create_box_mesh(
            [-W/2 + wall_t/2, y + H/2, D/4],
            [wall_t, H, D/2],
            floor_color
        ))

        # 前側牆（右半部）
        meshes.append(create_box_mesh(
            [W/4, y + H/2, -D/2 + wall_t/2],
            [W/2, H, wall_t],
            floor_color
        ))

        # 樓板
        meshes.append(create_box_mesh(
            [0, y + 0.02, 0],
            [W, 0.04, D],
            floor_color
        ))

        # 添加房間
        rooms = ROOM_DATA.get(floor_name, [])
        for room in rooms:
            room_color = ROOM_COLORS.get(room['type'], [128, 128, 128, 100])

            # 房間盒子（半透明）
            room_mesh = create_box_mesh(
                [room['x'], y + H*0.4, room['z']],
                [room['w'], H*0.8, room['d']],
                room_color
            )
            meshes.append(room_mesh)

            # 內部分隔牆
            wall_t2 = 0.02
            # 縱向分隔
            meshes.append(create_box_mesh(
                [room['x'], y + H*0.3, room['z']],
                [wall_t2, H*0.6, room['d']],
                PARTITION_COLOR
            ))
            # 橫向分隔
            meshes.append(create_box_mesh(
                [room['x'], y + H*0.3, room['z']],
                [room['w'], H*0.6, wall_t2],
                PARTITION_COLOR
            ))

            # 添加家具
            if '嬰兒' in room['name'] or '托嬰' in room['name']:
                # 白色嬰兒床
                for i in range(3):
                    meshes.append(create_box_mesh(
                        [room['x'] - room['w']/4 + i*room['w']/3, y + 0.08, room['z']],
                        [0.1, 0.15, 0.15],
                        FURNITURE_COLORS['white']
                    ))

            elif 'STEM' in room['name'] or '教室' in room['name']:
                # 棕色電腦桌
                for i in range(2):
                    meshes.append(create_box_mesh(
                        [room['x'] - room['w']/4 + i*room['w']/2, y + 0.08, room['z']],
                        [0.12, 0.15, 0.08],
                        FURNITURE_COLORS['brown']
                    ))

            elif '活動' in room['name']:
                # 活動桌
                meshes.append(create_box_mesh(
                    [room['x'], y + 0.08, room['z']],
                    [room['w']*0.6, 0.15, room['d']*0.6],
                    FURNITURE_COLORS['brown']
                ))

    # 頂樓板
    meshes.append(create_box_mesh(
        [0, H*8 + 0.03, 0],
        [W, 0.06, D],
        FLOOR_COLORS[7]
    ))

    print(f"\n✅ 建築元件數: {len(meshes)}")

    # 合併所有 mesh
    print("🔗 合併模型...")
    combined = trimesh.util.concatenate(meshes)

    return combined

def main():
    print("=" * 70)
    print("🏛️  赤土崎多功能館 GLB 模型生成器（PowerPoint 專用）")
    print("=" * 70)
    print("✅ 使用 GLB 格式（PowerPoint 首選）")
    print("✅ 真實專業配色（灰色調）")
    print("✅ 完整內部規劃展示")
    print("=" * 70)

    # 生成模型
    building = create_building_glb()

    # 保存為 GLB
    output_file = "赤土崎多功能館_PowerPoint專用.glb"
    print(f"\n💾 保存 GLB 文件: {output_file}")

    # trimesh 自動處理 GLB 導出
    building.export(output_file)

    import os
    file_size = os.path.getsize(output_file)

    print(f"\n📊 文件資訊:")
    print(f"   格式: GLB (Binary glTF)")
    print(f"   大小: {file_size / 1024:.1f} KB")
    print(f"   面片數: {len(building.faces)}")
    print(f"   頂點數: {len(building.vertices)}")

    print("\n" + "=" * 70)
    print("✨ PowerPoint 匯入步驟:")
    print(f"\n   1. 開啟 PowerPoint（需 Office 365 或 2019+）")
    print(f"   2. 插入 → 3D 模型 → 從文件")
    print(f"   3. 選擇: {output_file}")
    print(f"   4. 調整視角: 左前方俯視 45°")
    print(f"\n   💡 優勢:")
    print(f"   ✅ GLB 是 PowerPoint 原生支持格式")
    print(f"   ✅ 顏色自動嵌入，無需額外文件")
    print(f"   ✅ 文件小，載入快速")
    print(f"   ✅ 不會出現「匯入錯誤」")
    print("=" * 70)

if __name__ == "__main__":
    main()
