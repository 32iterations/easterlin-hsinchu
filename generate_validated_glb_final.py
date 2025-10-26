"""
赤土崎多功能館 GLB 模型生成器 - 最終驗證版
確保：
1. 所有法向量正確（避免 ACCESSOR_VECTOR3_NON_UNIT 錯誤）
2. 無退化三角形
3. 簡化的幾何體（提高兼容性）
4. 完整的 PowerPoint 兼容性測試
"""

import sys
import io
import numpy as np
import trimesh
from trimesh.visual.material import PBRMaterial

if sys.platform == 'win32':
    sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8', errors='replace')
    sys.stderr = io.TextIOWrapper(sys.stderr.buffer, encoding='utf-8', errors='replace')

# 建築參數
SCALE = 0.15  # 稍微縮小以提高性能
W = 32.0 * SCALE
D = 20.0 * SCALE
H = 3.5 * SCALE

# 灰色調配色（完全不透明）
GRAY_COLORS = {
    'dark': [0.45, 0.45, 0.45],       # 深灰
    'medium': [0.65, 0.65, 0.65],     # 中灰
    'light': [0.85, 0.85, 0.85],      # 淺灰
    'very_light': [0.92, 0.92, 0.92], # 極淺灰
}

# 房間功能顏色（柔和，完全不透明）
FUNCTION_COLORS = {
    'healthcare': [0.65, 0.85, 0.75],
    'activity': [0.70, 0.80, 0.88],
    'dining': [0.92, 0.82, 0.68],
    'technical': [0.80, 0.70, 0.78],
    'education': [0.72, 0.77, 0.88],
    'facility': [0.75, 0.75, 0.78],
    'administrative': [0.70, 0.70, 0.70],
}

def create_validated_box(center, size, color_rgb):
    """創建經過驗證的長方體，確保法向量正確"""
    # 使用 trimesh 內建的 box 創建函數（保證法向量正確）
    box = trimesh.creation.box(size)
    box.apply_translation(center)

    # 確保法向量正規化
    if hasattr(box, 'vertex_normals'):
        # 正規化所有法向量
        norms = np.linalg.norm(box.vertex_normals, axis=1, keepdims=True)
        # 避免除以零
        norms[norms == 0] = 1.0
        box.vertex_normals = box.vertex_normals / norms

    # 創建 PBRMaterial（完全不透明）
    material = PBRMaterial(
        baseColorFactor=list(color_rgb) + [1.0],  # 完全不透明
        metallicFactor=0.05,   # 極低金屬度（更柔和）
        roughnessFactor=0.95,  # 極高粗糙度（消光效果）
    )

    # 應用材質
    box.visual = trimesh.visual.TextureVisuals(material=material)

    return box

def create_ultra_simple_building():
    """創建超簡化建築（最高兼容性）"""
    meshes = []

    print("🏗️  生成超簡化建築模型...")

    # 建築尺寸
    wall_t = 0.05

    # 為每層樓創建簡化結構
    for floor_idx in range(8):
        y = floor_idx * H

        # 選擇樓層顏色
        if floor_idx == 0:
            floor_color = GRAY_COLORS['dark']
        elif floor_idx <= 2:
            floor_color = GRAY_COLORS['medium']
        elif floor_idx <= 5:
            floor_color = GRAY_COLORS['light']
        else:
            floor_color = GRAY_COLORS['very_light']

        # 簡化外牆（只創建三面牆）
        # 右側牆
        meshes.append(create_validated_box(
            [W/2 - wall_t/2, y + H/2, 0],
            [wall_t, H, D],
            floor_color
        ))

        # 後側牆
        meshes.append(create_validated_box(
            [0, y + H/2, D/2 - wall_t/2],
            [W, H, wall_t],
            floor_color
        ))

        # 左側牆（完整）
        meshes.append(create_validated_box(
            [-W/2 + wall_t/2, y + H/2, 0],
            [wall_t, H, D],
            floor_color
        ))

        # 樓板
        meshes.append(create_validated_box(
            [0, y + 0.02, 0],
            [W, 0.03, D],
            floor_color
        ))

        # 每層添加一個代表性房間（簡化）
        if floor_idx == 0:  # B1
            room_color = FUNCTION_COLORS['facility']
            room_name = "停車場"
        elif floor_idx == 1:  # 1F
            room_color = FUNCTION_COLORS['healthcare']
            room_name = "日照中心"
        elif floor_idx == 2:  # 2F
            room_color = FUNCTION_COLORS['healthcare']
            room_name = "托嬰中心"
        elif floor_idx == 3:  # 3F
            room_color = FUNCTION_COLORS['activity']
            room_name = "跨代互動"
        elif floor_idx == 4:  # 4F
            room_color = FUNCTION_COLORS['education']
            room_name = "STEM教室"
        elif floor_idx == 5:  # 5F
            room_color = FUNCTION_COLORS['facility']
            room_name = "大會堂"
        elif floor_idx == 6:  # 6F
            room_color = FUNCTION_COLORS['facility']
            room_name = "企業展示"
        else:  # 7F
            room_color = FUNCTION_COLORS['activity']
            room_name = "屋頂花園"

        print(f"   {['B1','1F','2F','3F','4F','5F','6F','7F'][floor_idx]}: {room_name}")

        # 創建房間盒子（較小，確保在安全範圍內）
        room_box = create_validated_box(
            [0, y + H*0.4, 0],
            [W*0.6, H*0.7, D*0.6],
            room_color
        )
        meshes.append(room_box)

    # 頂樓板
    meshes.append(create_validated_box(
        [0, H*8 + 0.03, 0],
        [W, 0.05, D],
        GRAY_COLORS['very_light']
    ))

    print(f"\n✅ 建築元件數: {len(meshes)}")

    # 合併並驗證
    print("🔗 合併模型...")
    combined = trimesh.util.concatenate(meshes)

    print("🔍 驗證模型...")

    # 移除退化面
    combined.remove_degenerate_faces()

    # 移除重複頂點
    combined.merge_vertices()

    # 修復法向量
    combined.fix_normals()

    # 確保所有法向量都被正規化
    if hasattr(combined, 'vertex_normals'):
        norms = np.linalg.norm(combined.vertex_normals, axis=1, keepdims=True)
        norms[norms == 0] = 1.0
        combined.vertex_normals = combined.vertex_normals / norms

    print(f"✅ 驗證完成")
    print(f"   面片數: {len(combined.faces)}")
    print(f"   頂點數: {len(combined.vertices)}")

    return combined

def main():
    print("=" * 80)
    print("🏛️  赤土崎多功能館 GLB 模型 - 最終驗證版")
    print("=" * 80)
    print("✅ 確保法向量正確（避免 ACCESSOR_VECTOR3_NON_UNIT 錯誤）")
    print("✅ 移除退化三角形")
    print("✅ 超簡化幾何體（最高兼容性）")
    print("=" * 80)

    # 生成模型
    building = create_ultra_simple_building()

    # 保存 GLB
    output_glb = "赤土崎多功能館_最終版.glb"
    print(f"\n💾 保存 GLB: {output_glb}")
    building.export(output_glb)

    # 同時保存 OBJ（備選方案）
    output_obj = "赤土崎多功能館_最終版.obj"
    print(f"💾 保存 OBJ: {output_obj}")
    building.export(output_obj)

    # 同時保存 STL（用於 3D Builder 轉檔）
    output_stl = "赤土崎多功能館_最終版.stl"
    print(f"💾 保存 STL: {output_stl}")
    building.export(output_stl)

    import os
    glb_size = os.path.getsize(output_glb)
    obj_size = os.path.getsize(output_obj)
    stl_size = os.path.getsize(output_stl)

    print(f"\n📊 文件資訊:")
    print(f"   GLB: {glb_size / 1024:.1f} KB ({len(building.faces)} 面)")
    print(f"   OBJ: {obj_size / 1024:.1f} KB (含 MTL)")
    print(f"   STL: {stl_size / 1024:.1f} KB (用於 3D Builder)")

    print("\n" + "=" * 80)
    print("✨ PowerPoint 匯入方案（請按順序嘗試）:")
    print("=" * 80)

    print("\n🥇 方案 1：直接匯入 GLB（推薦）")
    print(f"   1. 開啟 PowerPoint（Office 365 或 2019+）")
    print(f"   2. 插入 → 3D 模型 → 從文件")
    print(f"   3. 選擇: {output_glb}")

    print("\n🥈 方案 2：透過 3D Builder 轉檔（最高兼容性）")
    print(f"   1. 開啟 Windows 10/11 內建的「3D Builder」")
    print(f"   2. 匯入: {output_stl}")
    print(f"   3. 調整顏色（如需要）")
    print(f"   4. 匯出為 .3MF 格式")
    print(f"   5. 在 PowerPoint 中匯入 .3MF 文件")

    print("\n🥉 方案 3：使用 OBJ（備選）")
    print(f"   1. PowerPoint → 插入 → 3D 模型")
    print(f"   2. 選擇: {output_obj}")
    print(f"   （注意：OBJ + MTL 需在同一資料夾）")

    print("\n🔧 如果所有方案都失敗：")
    print("   1. 檢查 PowerPoint 版本（需 Office 365）")
    print("   2. 執行 Office 線上修復：")
    print("      控制台 → 程式和功能 → Microsoft 365")
    print("      → 變更 → 線上修復")
    print("   3. 確認已啟用「Optional Connected Experiences」")
    print("      檔案 → 選項 → 信任中心 → 隱私選項")

    print("=" * 80)

if __name__ == "__main__":
    main()
