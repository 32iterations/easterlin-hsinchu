"""
赤土崎多功能館 3D STL 模型 - 極簡版
最基礎版本，確保 PowerPoint 兼容性
"""

import sys
import io
import numpy as np
from stl import mesh

# Windows 編碼修正
if sys.platform == 'win32':
    sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8', errors='replace')
    sys.stderr = io.TextIOWrapper(sys.stderr.buffer, encoding='utf-8', errors='replace')

def create_ultra_simple_building():
    """創建極簡建築模型"""

    # 使用 1:100 比例（1 單位 = 1 公尺）
    width = 2.8   # 28m
    depth = 2.4   # 24m
    height = 2.8  # 28m (8層 x 3.5m)

    # 創建一個簡單的"口"字形建築（空心長方體）
    # 外部長方體的 8 個頂點
    outer_vertices = np.array([
        # 底部 4 個頂點
        [-width/2, 0, -depth/2],      # 0: 左前下
        [width/2, 0, -depth/2],       # 1: 右前下
        [width/2, 0, depth/2],        # 2: 右後下
        [-width/2, 0, depth/2],       # 3: 左後下
        # 頂部 4 個頂點
        [-width/2, height, -depth/2], # 4: 左前上
        [width/2, height, -depth/2],  # 5: 右前上
        [width/2, height, depth/2],   # 6: 右後上
        [-width/2, height, depth/2],  # 7: 左後上
    ])

    # 切面：只保留右半邊和後側
    faces = []

    # 1. 右側牆面（完整）
    faces.extend([
        [1, 5, 2],  # 右下三角
        [2, 5, 6],  # 右上三角
    ])

    # 2. 後側牆面（完整）
    faces.extend([
        [2, 6, 3],  # 後下三角
        [3, 6, 7],  # 後上三角
    ])

    # 3. 左側牆面（完整）
    faces.extend([
        [3, 7, 0],  # 左下三角
        [0, 7, 4],  # 左上三角
    ])

    # 4. 前側牆面（僅右半邊，左半邊切開）
    # 添加中間點
    mid_vertices = np.array([
        [0, 0, -depth/2],      # 8: 前下中
        [0, height, -depth/2], # 9: 前上中
    ])

    all_vertices = np.vstack([outer_vertices, mid_vertices])

    faces.extend([
        [8, 9, 1],  # 前右下三角
        [1, 9, 5],  # 前右上三角
    ])

    # 5. 底部（完整）
    faces.extend([
        [0, 1, 2],  # 底部三角 1
        [0, 2, 3],  # 底部三角 2
    ])

    # 6. 頂部（完整）
    faces.extend([
        [4, 6, 5],  # 頂部三角 1
        [4, 7, 6],  # 頂部三角 2
    ])

    # 7. 添加樓板（8 層）
    floor_vertices = []
    floor_faces = []

    for i in range(1, 8):  # 1F 到 7F
        y = i * (height / 8)
        base_idx = len(all_vertices) + len(floor_vertices)

        # 每層樓板的 4 個頂點
        floor_vertices.extend([
            [-width/2, y, -depth/2],
            [width/2, y, -depth/2],
            [width/2, y, depth/2],
            [-width/2, y, depth/2],
        ])

        # 樓板的 2 個三角面
        floor_faces.extend([
            [base_idx, base_idx+1, base_idx+2],
            [base_idx, base_idx+2, base_idx+3],
        ])

    # 合併所有頂點和面
    all_vertices = np.vstack([all_vertices, floor_vertices])
    faces.extend(floor_faces)
    faces_array = np.array(faces)

    # 創建 mesh
    building_mesh = mesh.Mesh(np.zeros(faces_array.shape[0], dtype=mesh.Mesh.dtype))

    for i, face in enumerate(faces_array):
        for j in range(3):
            building_mesh.vectors[i][j] = all_vertices[face[j]]

    # 更新法向量
    building_mesh.update_normals()

    return building_mesh

def main():
    print("=" * 70)
    print("🏛️  赤土崎多功能館 3D 模型 - 極簡版（PowerPoint 專用）")
    print("=" * 70)

    print("\n🏗️  生成極簡模型...")
    building = create_ultra_simple_building()

    print(f"✅ 生成完成")
    print(f"   面片數: {len(building.vectors)}")
    print(f"   邊界: X({building.x.min():.2f} ~ {building.x.max():.2f})")
    print(f"        Y({building.y.min():.2f} ~ {building.y.max():.2f})")
    print(f"        Z({building.z.min():.2f} ~ {building.z.max():.2f})")

    # 保存文件
    output_file = "赤土崎多功能館_極簡版.stl"
    print(f"\n💾 保存文件: {output_file}")
    building.save(output_file)

    import os
    file_size = os.path.getsize(output_file)
    print(f"   文件大小: {file_size / 1024:.2f} KB")

    print("\n" + "=" * 70)
    print("✨ 完成！這是最簡化版本，包含：")
    print("   ✓ 建築外框（左側切開展示內部）")
    print("   ✓ 7 層內部樓板（清楚展示樓層分隔）")
    print("   ✓ 最少面片數，最高兼容性")
    print("\n   📥 PowerPoint 匯入步驟：")
    print(f"   1. 插入 → 3D 模型 → 從文件")
    print(f"   2. 選擇: {output_file}")
    print("=" * 70)

if __name__ == "__main__":
    main()
