"""
赤土崎多功能館 3D STL 模型生成器（PowerPoint 優化版）
簡化版本，確保 PowerPoint 兼容性
"""

import sys
import io
import numpy as np
from stl import mesh

# Windows 編碼修正
if sys.platform == 'win32':
    sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8', errors='replace')
    sys.stderr = io.TextIOWrapper(sys.stderr.buffer, encoding='utf-8', errors='replace')

# 建築參數（縮小 10 倍以適應 PowerPoint）
SCALE = 0.1  # 縮放因子
BUILDING_WIDTH = 28.0 * SCALE
BUILDING_DEPTH = 24.0 * SCALE
FLOOR_HEIGHT = 3.5 * SCALE
WALL_THICKNESS = 0.3 * SCALE

def create_box_mesh(x, y, z, width, height, depth):
    """創建一個簡單的長方體 mesh"""
    # 定義 8 個頂點
    vertices = np.array([
        [x, y, z],
        [x + width, y, z],
        [x + width, y + height, z],
        [x, y + height, z],
        [x, y, z + depth],
        [x + width, y, z + depth],
        [x + width, y + height, z + depth],
        [x, y + height, z + depth],
    ])

    # 定義 12 個三角形面（每面 2 個三角形）
    faces = np.array([
        [0, 3, 1], [1, 3, 2],  # 前面
        [4, 5, 7], [5, 6, 7],  # 後面
        [0, 1, 5], [0, 5, 4],  # 底面
        [2, 3, 7], [2, 7, 6],  # 頂面
        [0, 4, 7], [0, 7, 3],  # 左面
        [1, 2, 6], [1, 6, 5],  # 右面
    ])

    return vertices, faces

def combine_meshes(mesh_list):
    """合併多個 mesh"""
    if not mesh_list:
        return None

    total_faces = sum(len(m['faces']) for m in mesh_list)
    combined = mesh.Mesh(np.zeros(total_faces, dtype=mesh.Mesh.dtype))

    face_idx = 0
    for m in mesh_list:
        for i, face in enumerate(m['faces']):
            for j in range(3):
                combined.vectors[face_idx][j] = m['vertices'][face[j]]
            face_idx += 1

    return combined

def create_simplified_building():
    """創建簡化版建築模型（PowerPoint 優化）"""
    mesh_parts = []

    print("🏗️  生成簡化建築模型（PowerPoint 優化版）...")

    # 1. 外框架（只創建關鍵結構）
    print("📐 生成建築外框...")

    # 左側牆
    verts, faces = create_box_mesh(
        -BUILDING_WIDTH/2, 0, -BUILDING_DEPTH/2,
        WALL_THICKNESS, FLOOR_HEIGHT * 8, BUILDING_DEPTH
    )
    mesh_parts.append({'vertices': verts, 'faces': faces})

    # 右側牆
    verts, faces = create_box_mesh(
        BUILDING_WIDTH/2 - WALL_THICKNESS, 0, -BUILDING_DEPTH/2,
        WALL_THICKNESS, FLOOR_HEIGHT * 8, BUILDING_DEPTH
    )
    mesh_parts.append({'vertices': verts, 'faces': faces})

    # 後側牆
    verts, faces = create_box_mesh(
        -BUILDING_WIDTH/2, 0, BUILDING_DEPTH/2 - WALL_THICKNESS,
        BUILDING_WIDTH, FLOOR_HEIGHT * 8, WALL_THICKNESS
    )
    mesh_parts.append({'vertices': verts, 'faces': faces})

    # 前側牆（右半邊，左半邊切開）
    verts, faces = create_box_mesh(
        0, 0, -BUILDING_DEPTH/2,
        BUILDING_WIDTH/2, FLOOR_HEIGHT * 8, WALL_THICKNESS
    )
    mesh_parts.append({'vertices': verts, 'faces': faces})

    # 2. 樓板（8 層）
    print("🏢 生成樓板...")
    for floor_num in range(9):  # B1 到 7F，共 9 個樓板
        y = floor_num * FLOOR_HEIGHT
        verts, faces = create_box_mesh(
            -BUILDING_WIDTH/2, y, -BUILDING_DEPTH/2,
            BUILDING_WIDTH, 0.02, BUILDING_DEPTH  # 2cm 厚樓板
        )
        mesh_parts.append({'vertices': verts, 'faces': faces})

    # 3. 中央分隔牆（每層一道，展示房間分隔）
    print("🚪 生成房間分隔...")
    for floor_num in range(8):  # 8 層樓
        y_base = floor_num * FLOOR_HEIGHT

        # 中央縱向分隔牆
        verts, faces = create_box_mesh(
            -0.05, y_base + 0.02, -BUILDING_DEPTH/2,
            0.1, FLOOR_HEIGHT - 0.02, BUILDING_DEPTH
        )
        mesh_parts.append({'vertices': verts, 'faces': faces})

        # 前後橫向分隔牆（展示前後區域）
        verts, faces = create_box_mesh(
            -BUILDING_WIDTH/2, y_base + 0.02, -0.05,
            BUILDING_WIDTH, FLOOR_HEIGHT - 0.02, 0.1
        )
        mesh_parts.append({'vertices': verts, 'faces': faces})

    # 4. 屋頂
    print("🏠 生成屋頂...")
    verts, faces = create_box_mesh(
        -BUILDING_WIDTH/2, FLOOR_HEIGHT * 8, -BUILDING_DEPTH/2,
        BUILDING_WIDTH, 0.03, BUILDING_DEPTH
    )
    mesh_parts.append({'vertices': verts, 'faces': faces})

    print(f"✅ 模型部件數: {len(mesh_parts)}")

    # 合併所有 mesh
    print("🔗 合併模型...")
    combined = combine_meshes(mesh_parts)

    return combined

def create_cross_section_marker():
    """創建切面標記（小方塊，標示切開位置）"""
    markers = []

    # 在切開邊緣添加標記
    for floor_num in range(8):
        y = floor_num * FLOOR_HEIGHT + FLOOR_HEIGHT / 2
        verts, faces = create_box_mesh(
            -0.1, y - 0.05, -BUILDING_DEPTH/2 - 0.1,
            0.2, 0.1, 0.2
        )
        markers.append({'vertices': verts, 'faces': faces})

    return combine_meshes(markers)

def validate_mesh(mesh_obj):
    """驗證 mesh 是否有效"""
    print("\n🔍 驗證模型...")

    # 檢查是否有 NaN 或 Inf
    if np.any(np.isnan(mesh_obj.vectors)) or np.any(np.isinf(mesh_obj.vectors)):
        print("❌ 錯誤：模型包含無效數值 (NaN/Inf)")
        return False

    # 計算法向量
    mesh_obj.update_normals()

    print(f"✅ 面片數: {len(mesh_obj.vectors)}")
    print(f"✅ 邊界框: X({mesh_obj.x.min():.2f}, {mesh_obj.x.max():.2f})")
    print(f"          Y({mesh_obj.y.min():.2f}, {mesh_obj.y.max():.2f})")
    print(f"          Z({mesh_obj.z.min():.2f}, {mesh_obj.z.max():.2f})")

    return True

def main():
    print("=" * 70)
    print("🏛️  赤土崎多功能館 3D 模型生成器（PowerPoint 優化版）")
    print("=" * 70)

    # 生成建築主體
    building = create_simplified_building()

    if building is None:
        print("❌ 生成失敗")
        return

    # 驗證模型
    if not validate_mesh(building):
        print("❌ 模型驗證失敗")
        return

    # 保存 Binary 格式（默認，文件較小）
    output_binary = "赤土崎多功能館_PowerPoint版.stl"
    print(f"\n💾 保存 Binary STL: {output_binary}")
    building.save(output_binary)

    # 顯示文件大小
    import os
    file_size = os.path.getsize(output_binary)

    print(f"\n📊 文件資訊:")
    print(f"   文件大小: {file_size / 1024:.2f} KB")
    print(f"   面片數量: {len(building.vectors)}")

    print("\n" + "=" * 70)
    print("✨ 完成！PowerPoint 使用步驟：")
    print(f"\n   1. 開啟 PowerPoint 2016 或更新版本")
    print(f"   2. 插入 → 3D 模型 → 從文件")
    print(f"   3. 選擇: {output_binary}")
    print(f"\n   💡 展示建議：")
    print("   - 旋轉至左前方 45° 俯視角度（最佳視角）")
    print("   - 左側切開部分清楚展示內部 8 層樓")
    print("   - 每層樓板和分隔牆清晰可見")
    print("   - 可在簡報時動態旋轉模型")
    print("\n   🎯 如果仍無法匯入，可能原因：")
    print("   - PowerPoint 版本過舊（需 2016 或更新）")
    print("   - 需更新 Office 至最新版本")
    print("   - 可嘗試線上版 PowerPoint (office.com)")
    print("=" * 70)

if __name__ == "__main__":
    main()
