"""
赤土崎多功能館 3D STL 模型生成器（切面展示版）
生成可嵌入 PowerPoint 的 .stl 3D 模型文件
"""

import sys
import io
import numpy as np
from stl import mesh
import re

# Windows 編碼修正
if sys.platform == 'win32':
    sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8', errors='replace')
    sys.stderr = io.TextIOWrapper(sys.stderr.buffer, encoding='utf-8', errors='replace')

# 建築參數
BUILDING_WIDTH = 28.0   # X 軸方向（米）
BUILDING_DEPTH = 24.0   # Z 軸方向（米）
FLOOR_HEIGHT = 3.5      # 每層樓高（米）
WALL_THICKNESS = 0.3    # 牆厚（米）
FLOORS = ['B1', '1F', '2F', '3F', '4F', '5F', '6F', '7F']

# 樓層 Y 座標（B1 在 0，往上遞增）
FLOOR_Y = {
    'B1': 0,
    '1F': FLOOR_HEIGHT,
    '2F': FLOOR_HEIGHT * 2,
    '3F': FLOOR_HEIGHT * 3,
    '4F': FLOOR_HEIGHT * 4,
    '5F': FLOOR_HEIGHT * 5,
    '6F': FLOOR_HEIGHT * 6,
    '7F': FLOOR_HEIGHT * 7,
}

# 簡化的房間數據（從 HTML 提取的關鍵房間）
ROOM_DATA = {
    'B1': [
        {'name': '停車場', 'x': 0, 'z': 3, 'w': 28, 'd': 10},
        {'name': '機房', 'x': 0, 'z': -7, 'w': 28, 'd': 4},
    ],
    '1F': [
        {'name': '失智症專區', 'x': -9, 'z': -2, 'w': 12, 'd': 13},
        {'name': '日照活動區', 'x': 3, 'z': -2, 'w': 11, 'd': 13},
        {'name': '大廳', 'x': -9, 'z': -10, 'w': 23, 'd': 5},
    ],
    '2F': [
        {'name': '托嬰中心', 'x': -9, 'z': -2, 'w': 12, 'd': 13},
        {'name': '親子共學區', 'x': 3, 'z': -2, 'w': 11, 'd': 13},
        {'name': '辦公室', 'x': -9, 'z': -10, 'w': 23, 'd': 5},
    ],
    '3F': [
        {'name': '青少年活動室', 'x': -9, 'z': -2, 'w': 12, 'd': 13},
        {'name': 'VR教室', 'x': 3, 'z': -2, 'w': 11, 'd': 13},
        {'name': '諮商室', 'x': -9, 'z': -10, 'w': 23, 'd': 5},
    ],
    '4F': [
        {'name': 'STEM教室', 'x': -9, 'z': -2, 'w': 12, 'd': 13},
        {'name': '創客空間', 'x': 3, 'z': -2, 'w': 11, 'd': 13},
        {'name': '展示區', 'x': -9, 'z': -10, 'w': 23, 'd': 5},
    ],
    '5F': [
        {'name': '時間銀行中心', 'x': -9, 'z': -2, 'w': 12, 'd': 13},
        {'name': '志工培訓室', 'x': 3, 'z': -2, 'w': 11, 'd': 13},
        {'name': '會議室', 'x': -9, 'z': -10, 'w': 23, 'd': 5},
    ],
    '6F': [
        {'name': '記憶銀行', 'x': -9, 'z': -2, 'w': 12, 'd': 13},
        {'name': 'AI互動區', 'x': 3, 'z': -2, 'w': 11, 'd': 13},
        {'name': '多功能廳', 'x': -9, 'z': -10, 'w': 23, 'd': 5},
    ],
    '7F': [
        {'name': '太陽能展示區', 'x': -9, 'z': -2, 'w': 12, 'd': 13},
        {'name': 'ESG企業展示館', 'x': 3, 'z': -2, 'w': 11, 'd': 13},
        {'name': '空中花園', 'x': -9, 'z': -10, 'w': 23, 'd': 5},
    ],
}

def create_box(x_min, x_max, y_min, y_max, z_min, z_max):
    """創建一個長方體的三角面片"""
    vertices = np.array([
        [x_min, y_min, z_min],
        [x_max, y_min, z_min],
        [x_max, y_max, z_min],
        [x_min, y_max, z_min],
        [x_min, y_min, z_max],
        [x_max, y_min, z_max],
        [x_max, y_max, z_max],
        [x_min, y_max, z_max],
    ])

    faces = np.array([
        [0, 3, 1], [1, 3, 2],  # 前面 (z_min)
        [4, 5, 7], [5, 6, 7],  # 後面 (z_max)
        [0, 1, 5], [0, 5, 4],  # 底面 (y_min)
        [2, 3, 7], [2, 7, 6],  # 頂面 (y_max)
        [0, 4, 7], [0, 7, 3],  # 左面 (x_min)
        [1, 2, 6], [1, 6, 5],  # 右面 (x_max)
    ])

    return vertices, faces

def create_wall_with_cutout(x_min, x_max, y_min, y_max, z_pos, thickness, cut_ratio=0.5):
    """創建一個有切口的牆面（用於展示內部）"""
    vertices = []
    faces = []

    # 只創建部分牆面（切掉一半）
    if cut_ratio > 0:
        # 前半部分牆面
        front_verts = np.array([
            [x_min, y_min, z_pos],
            [x_max * cut_ratio, y_min, z_pos],
            [x_max * cut_ratio, y_max, z_pos],
            [x_min, y_max, z_pos],
        ])
        vertices.extend(front_verts)

        # 添加前牆面的三角形
        base_idx = 0
        faces.extend([
            [base_idx, base_idx + 1, base_idx + 2],
            [base_idx, base_idx + 2, base_idx + 3],
        ])

    return np.array(vertices), np.array(faces) if faces else np.array([])

def create_building_model():
    """創建完整的建築 3D 模型（帶切面）"""
    all_vertices = []
    all_faces = []

    print("🏗️  開始生成建築模型...")

    # 1. 創建外牆（前側切開 50%）
    print("📐 生成外牆...")

    # 左側牆（完整）
    verts, faces = create_box(
        -BUILDING_WIDTH/2, -BUILDING_WIDTH/2 + WALL_THICKNESS,
        0, FLOOR_HEIGHT * 8,
        -BUILDING_DEPTH/2, BUILDING_DEPTH/2
    )
    offset = len(all_vertices)
    all_vertices.extend(verts)
    all_faces.extend(faces + offset)

    # 右側牆（完整）
    verts, faces = create_box(
        BUILDING_WIDTH/2 - WALL_THICKNESS, BUILDING_WIDTH/2,
        0, FLOOR_HEIGHT * 8,
        -BUILDING_DEPTH/2, BUILDING_DEPTH/2
    )
    offset = len(all_vertices)
    all_vertices.extend(verts)
    all_faces.extend(faces + offset)

    # 後側牆（完整）
    verts, faces = create_box(
        -BUILDING_WIDTH/2, BUILDING_WIDTH/2,
        0, FLOOR_HEIGHT * 8,
        BUILDING_DEPTH/2 - WALL_THICKNESS, BUILDING_DEPTH/2
    )
    offset = len(all_vertices)
    all_vertices.extend(verts)
    all_faces.extend(faces + offset)

    # 前側牆（切開 50% 以展示內部）
    # 只保留右半邊
    verts, faces = create_box(
        0, BUILDING_WIDTH/2,
        0, FLOOR_HEIGHT * 8,
        -BUILDING_DEPTH/2, -BUILDING_DEPTH/2 + WALL_THICKNESS
    )
    offset = len(all_vertices)
    all_vertices.extend(verts)
    all_faces.extend(faces + offset)

    # 2. 創建樓板
    print("🏢 生成樓板...")
    for floor_name in FLOORS:
        y = FLOOR_Y[floor_name]
        # 完整樓板
        verts, faces = create_box(
            -BUILDING_WIDTH/2, BUILDING_WIDTH/2,
            y, y + 0.2,  # 20cm 厚樓板
            -BUILDING_DEPTH/2, BUILDING_DEPTH/2
        )
        offset = len(all_vertices)
        all_vertices.extend(verts)
        all_faces.extend(faces + offset)

    # 3. 創建房間隔牆
    print("🚪 生成房間隔牆...")
    for floor_name, rooms in ROOM_DATA.items():
        y_base = FLOOR_Y[floor_name]
        y_top = y_base + FLOOR_HEIGHT

        for room in rooms:
            x_center = room['x']
            z_center = room['z']
            width = room['w']
            depth = room['d']

            # 房間四面牆（較薄，僅用於分隔）
            thin_wall = 0.15

            # 左牆
            verts, faces = create_box(
                x_center - width/2, x_center - width/2 + thin_wall,
                y_base + 0.2, y_top,
                z_center - depth/2, z_center + depth/2
            )
            offset = len(all_vertices)
            all_vertices.extend(verts)
            all_faces.extend(faces + offset)

            # 右牆
            verts, faces = create_box(
                x_center + width/2 - thin_wall, x_center + width/2,
                y_base + 0.2, y_top,
                z_center - depth/2, z_center + depth/2
            )
            offset = len(all_vertices)
            all_vertices.extend(verts)
            all_faces.extend(faces + offset)

            # 前牆（只在未切開區域）
            if x_center + width/2 > 0:  # 右半邊有前牆
                x_start = max(0, x_center - width/2)
                verts, faces = create_box(
                    x_start, x_center + width/2,
                    y_base + 0.2, y_top,
                    z_center - depth/2, z_center - depth/2 + thin_wall
                )
                offset = len(all_vertices)
                all_vertices.extend(verts)
                all_faces.extend(faces + offset)

            # 後牆
            verts, faces = create_box(
                x_center - width/2, x_center + width/2,
                y_base + 0.2, y_top,
                z_center + depth/2 - thin_wall, z_center + depth/2
            )
            offset = len(all_vertices)
            all_vertices.extend(verts)
            all_faces.extend(faces + offset)

    # 4. 創建頂樓
    print("🏠 生成屋頂...")
    verts, faces = create_box(
        -BUILDING_WIDTH/2, BUILDING_WIDTH/2,
        FLOOR_HEIGHT * 8, FLOOR_HEIGHT * 8 + 0.3,
        -BUILDING_DEPTH/2, BUILDING_DEPTH/2
    )
    offset = len(all_vertices)
    all_vertices.extend(verts)
    all_faces.extend(faces + offset)

    # 轉換為 numpy 陣列
    vertices_array = np.array(all_vertices)
    faces_array = np.array(all_faces)

    print(f"✅ 模型生成完成！")
    print(f"   頂點數: {len(vertices_array)}")
    print(f"   面片數: {len(faces_array)}")

    return vertices_array, faces_array

def save_stl(vertices, faces, filename):
    """將模型保存為 STL 文件"""
    # 創建 mesh
    building_mesh = mesh.Mesh(np.zeros(faces.shape[0], dtype=mesh.Mesh.dtype))

    for i, face in enumerate(faces):
        for j in range(3):
            building_mesh.vectors[i][j] = vertices[face[j]]

    # 保存為二進制 STL（文件較小）
    building_mesh.save(filename)
    print(f"💾 STL 文件已保存: {filename}")

    # 顯示文件大小
    import os
    file_size = os.path.getsize(filename)
    print(f"   文件大小: {file_size / 1024:.2f} KB")

def main():
    print("=" * 60)
    print("🏛️  赤土崎多功能館 3D 模型生成器（切面展示版）")
    print("=" * 60)

    # 生成模型
    vertices, faces = create_building_model()

    # 保存 STL 文件
    output_file = "赤土崎多功能館_3D模型_切面展示.stl"
    save_stl(vertices, faces, output_file)

    print("\n" + "=" * 60)
    print("✨ 完成！您現在可以將此 STL 文件嵌入 PowerPoint")
    print("   PowerPoint 操作步驟：")
    print("   1. 插入 → 3D 模型 → 從文件")
    print("   2. 選擇 " + output_file)
    print("   3. 調整大小和角度以展示內部結構")
    print("=" * 60)

if __name__ == "__main__":
    main()
