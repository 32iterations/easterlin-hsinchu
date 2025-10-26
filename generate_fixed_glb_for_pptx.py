"""
赤土崎多功能館 GLB 模型生成器 - 完全修復版
修復問題：
1. Z-Fighting（房間超出外牆）
2. PowerPoint 不支援透明度
3. 使用正確的 PBRMaterial 系統
"""

import sys
import io
import numpy as np
import trimesh
from trimesh.visual.material import PBRMaterial

# Windows 編碼修正
if sys.platform == 'win32':
    sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8', errors='replace')
    sys.stderr = io.TextIOWrapper(sys.stderr.buffer, encoding='utf-8', errors='replace')

# 建築參數
SCALE = 0.2
W = 32.0 * SCALE
D = 20.0 * SCALE
H = 3.5 * SCALE
WALL_T = 0.06
SAFETY_MARGIN = 0.15  # 安全間距，避免 Z-Fighting

# 外牆邊界（內側，扣除安全間距）
SAFE_BOUNDS = {
    'x_min': -W/2 + WALL_T + SAFETY_MARGIN,
    'x_max': W/2 - WALL_T - SAFETY_MARGIN,
    'z_min': -D/2 + WALL_T + SAFETY_MARGIN,
    'z_max': D/2 - WALL_T - SAFETY_MARGIN,
}

# 真實樓層顏色（完全不透明！PowerPoint 不支援透明度）
FLOOR_COLORS_RGB = [
    [0.48, 0.48, 0.48],  # B1 深灰
    [0.60, 0.60, 0.60],  # 1F 灰
    [0.60, 0.60, 0.60],  # 2F 灰
    [0.69, 0.69, 0.69],  # 3F 淺灰
    [0.96, 0.96, 0.96],  # 4F 極淺灰
    [0.96, 0.96, 0.96],  # 5F 極淺灰
    [0.94, 0.94, 0.94],  # 6F 灰白
    [0.91, 0.91, 0.91],  # 7F 灰白
]

# 房間類型顏色（完全不透明，使用柔和的顏色）
ROOM_COLORS_RGB = {
    'healthcare': [0.60, 0.85, 0.75],  # 柔和青綠色
    'activity': [0.65, 0.80, 0.90],    # 柔和青藍色
    'dining': [0.95, 0.85, 0.70],      # 柔和橙色
    'technical': [0.85, 0.70, 0.80],   # 柔和紫紅色
    'education': [0.70, 0.75, 0.90],   # 柔和藍色
    'facility': [0.75, 0.75, 0.80],    # 灰藍
    'administrative': [0.70, 0.70, 0.70],  # 中灰
}

# 家具顏色
FURNITURE_COLORS_RGB = {
    'white': [0.95, 0.95, 0.95],
    'brown': [0.55, 0.27, 0.07],
    'darkbrown': [0.41, 0.41, 0.36],
}

# 分隔牆顏色
PARTITION_COLOR_RGB = [0.83, 0.83, 0.83]

# 修正後的房間數據（確保都在安全邊界內）
ROOM_DATA_FIXED = {
    'B1': [
        {'name': '停車場', 'x': 0, 'z': 0.4, 'w': 5.2, 'd': 1.8, 'type': 'facility'},
        {'name': '機房區', 'x': 0, 'z': -1.5, 'w': 5.2, 'd': 0.5, 'type': 'technical'},
    ],
    '1F': [
        {'name': '失智症專區', 'x': -1.6, 'z': -0.3, 'w': 2.2, 'd': 2.2, 'type': 'healthcare'},
        {'name': '日照活動區', 'x': 1.2, 'z': -0.3, 'w': 2.2, 'd': 2.2, 'type': 'healthcare'},
        {'name': '共享餐廳', 'x': 0, 'z': 1.3, 'w': 3.2, 'd': 0.7, 'type': 'dining'},
    ],
    '2F': [
        {'name': '0-2歲嬰兒教室', 'x': -1.4, 'z': 0.6, 'w': 2.2, 'd': 1.8, 'type': 'healthcare'},
        {'name': '2-3歲幼兒教室', 'x': 1.4, 'z': 0.6, 'w': 2.2, 'd': 1.6, 'type': 'activity'},
        {'name': '親子共讀區', 'x': -1.4, 'z': -0.7, 'w': 1.8, 'd': 1.0, 'type': 'education'},
        {'name': '支援設施', 'x': 1.4, 'z': -0.7, 'w': 1.8, 'd': 1.0, 'type': 'facility'},
    ],
    '3F': [
        {'name': '棋牌活動室', 'x': -1.9, 'z': 0.5, 'w': 1.8, 'd': 1.2, 'type': 'activity'},
        {'name': '手工藝活動室', 'x': -0.2, 'z': 0.5, 'w': 1.8, 'd': 1.2, 'type': 'activity'},
        {'name': '復健活動室', 'x': 1.5, 'z': 0.5, 'w': 1.8, 'd': 1.2, 'type': 'activity'},
        {'name': '跨代互動室', 'x': 0, 'z': -0.6, 'w': 2.0, 'd': 0.8, 'type': 'education'},
    ],
    '4F': [
        {'name': 'STEM教室', 'x': -1.8, 'z': 0.7, 'w': 1.6, 'd': 0.9, 'type': 'education'},
        {'name': 'VR投影區', 'x': 1.6, 'z': 0.3, 'w': 1.6, 'd': 0.7, 'type': 'activity'},
        {'name': '青少年交誼廳', 'x': 0, 'z': -0.4, 'w': 2.0, 'd': 0.6, 'type': 'activity'},
        {'name': '文創工坊', 'x': -1.5, 'z': -1.3, 'w': 1.4, 'd': 0.5, 'type': 'activity'},
        {'name': '課輔自習區', 'x': 0, 'z': -1.3, 'w': 1.4, 'd': 0.5, 'type': 'education'},
        {'name': '休閒娛樂區', 'x': 2.2, 'z': -1.0, 'w': 1.4, 'd': 0.4, 'type': 'activity'},
    ],
    '5F': [
        {'name': '大會堂', 'x': 0, 'z': 0.3, 'w': 4.8, 'd': 2.0, 'type': 'facility'},
        {'name': '工作坊室', 'x': -2.0, 'z': -1.5, 'w': 1.4, 'd': 0.5, 'type': 'education'},
        {'name': '議事室', 'x': 2.0, 'z': -1.5, 'w': 1.4, 'd': 0.5, 'type': 'administrative'},
    ],
    '6F': [
        {'name': '企業展示廳', 'x': 0, 'z': 0.3, 'w': 4.4, 'd': 1.8, 'type': 'facility'},
        {'name': '業師辦公室', 'x': -1.4, 'z': -1.3, 'w': 2.0, 'd': 1.0, 'type': 'administrative'},
        {'name': '會議室', 'x': 2.0, 'z': -1.3, 'w': 1.8, 'd': 1.0, 'type': 'administrative'},
    ],
    '7F': [
        {'name': '屋頂農場', 'x': -1.2, 'z': -0.3, 'w': 2.0, 'd': 1.6, 'type': 'facility'},
        {'name': '太陽能區', 'x': 1.2, 'z': -0.3, 'w': 2.0, 'd': 1.6, 'type': 'technical'},
        {'name': '露台區', 'x': 0, 'z': 1.3, 'w': 2.4, 'd': 0.8, 'type': 'activity'},
    ],
}

def clip_to_bounds(x, z, w, d):
    """裁剪房間到安全邊界內"""
    x_min = max(x - w/2, SAFE_BOUNDS['x_min'])
    x_max = min(x + w/2, SAFE_BOUNDS['x_max'])
    z_min = max(z - d/2, SAFE_BOUNDS['z_min'])
    z_max = min(z + d/2, SAFE_BOUNDS['z_max'])

    new_w = x_max - x_min
    new_d = z_max - z_min
    new_x = (x_min + x_max) / 2
    new_z = (z_min + z_max) / 2

    return new_x, new_z, new_w, new_d

def create_mesh_with_material(geometry, color_rgb, metallic=0.1, roughness=0.9):
    """創建帶 PBRMaterial 的 mesh"""
    # 創建 PBRMaterial
    material = PBRMaterial(
        baseColorFactor=list(color_rgb) + [1.0],  # RGBA，完全不透明
        metallicFactor=metallic,
        roughnessFactor=roughness,
    )

    # 創建 mesh
    mesh = trimesh.Trimesh(
        vertices=geometry.vertices,
        faces=geometry.faces,
        visual=trimesh.visual.TextureVisuals(material=material)
    )

    return mesh

def create_building_fixed():
    """創建修復後的建築模型"""
    meshes = []

    print("🏗️  生成修復後的建築結構...")
    print(f"   安全邊界: X:[{SAFE_BOUNDS['x_min']:.2f}, {SAFE_BOUNDS['x_max']:.2f}]")
    print(f"             Z:[{SAFE_BOUNDS['z_min']:.2f}, {SAFE_BOUNDS['z_max']:.2f}]\n")

    violations_fixed = 0

    # 為每層樓創建結構
    for floor_idx in range(8):
        y = floor_idx * H
        floor_color = FLOOR_COLORS_RGB[floor_idx]
        floor_name = ['B1','1F','2F','3F','4F','5F','6F','7F'][floor_idx]

        print(f"   {floor_name}: {['停車場','失智/日照','托嬰中心','跨代互動','STEM/VR','大會堂','企業展示','屋頂花園'][floor_idx]}")

        # 外牆（四分之一切開）
        # 右側牆
        wall_geom = trimesh.creation.box([WALL_T, H, D])
        wall_geom.apply_translation([W/2 - WALL_T/2, y + H/2, 0])
        meshes.append(create_mesh_with_material(wall_geom, floor_color, metallic=0.2, roughness=0.8))

        # 後側牆
        wall_geom = trimesh.creation.box([W, H, WALL_T])
        wall_geom.apply_translation([0, y + H/2, D/2 - WALL_T/2])
        meshes.append(create_mesh_with_material(wall_geom, floor_color, metallic=0.2, roughness=0.8))

        # 左側牆（後半部）
        wall_geom = trimesh.creation.box([WALL_T, H, D/2])
        wall_geom.apply_translation([-W/2 + WALL_T/2, y + H/2, D/4])
        meshes.append(create_mesh_with_material(wall_geom, floor_color, metallic=0.2, roughness=0.8))

        # 前側牆（右半部）
        wall_geom = trimesh.creation.box([W/2, H, WALL_T])
        wall_geom.apply_translation([W/4, y + H/2, -D/2 + WALL_T/2])
        meshes.append(create_mesh_with_material(wall_geom, floor_color, metallic=0.2, roughness=0.8))

        # 樓板
        floor_geom = trimesh.creation.box([W, 0.04, D])
        floor_geom.apply_translation([0, y + 0.02, 0])
        meshes.append(create_mesh_with_material(floor_geom, floor_color, metallic=0.2, roughness=0.8))

        # 添加房間
        rooms = ROOM_DATA_FIXED.get(floor_name, [])
        for room in rooms:
            room_color = ROOM_COLORS_RGB.get(room['type'], [0.7, 0.7, 0.7])

            # 裁剪到安全邊界
            rx, rz, rw, rd = clip_to_bounds(room['x'], room['z'], room['w'], room['d'])

            # 檢查是否有裁剪
            if abs(rx - room['x']) > 0.01 or abs(rz - room['z']) > 0.01 or abs(rw - room['w']) > 0.01 or abs(rd - room['d']) > 0.01:
                violations_fixed += 1

            # 房間盒子（完全不透明）
            room_geom = trimesh.creation.box([rw, H*0.75, rd])
            room_geom.apply_translation([rx, y + H*0.375 + 0.05, rz])
            meshes.append(create_mesh_with_material(room_geom, room_color, metallic=0.1, roughness=0.9))

            # 內部分隔牆（降低高度以避免與天花板碰撞）
            wall_t2 = 0.02
            wall_h = H * 0.6

            # 縱向分隔
            part_geom = trimesh.creation.box([wall_t2, wall_h, rd * 0.9])
            part_geom.apply_translation([rx, y + wall_h/2 + 0.05, rz])
            meshes.append(create_mesh_with_material(part_geom, PARTITION_COLOR_RGB, metallic=0.1, roughness=0.95))

            # 橫向分隔
            part_geom = trimesh.creation.box([rw * 0.9, wall_h, wall_t2])
            part_geom.apply_translation([rx, y + wall_h/2 + 0.05, rz])
            meshes.append(create_mesh_with_material(part_geom, PARTITION_COLOR_RGB, metallic=0.1, roughness=0.95))

            # 添加家具（縮小以避免碰撞）
            if '嬰兒' in room['name'] or '托嬰' in room['name']:
                for i in range(2):  # 減少家具數量
                    furn_geom = trimesh.creation.box([0.08, 0.12, 0.12])
                    furn_geom.apply_translation([rx - rw/4 + i*rw/2.5, y + 0.06, rz])
                    meshes.append(create_mesh_with_material(furn_geom, FURNITURE_COLORS_RGB['white'], metallic=0.3, roughness=0.7))

            elif 'STEM' in room['name'] or '教室' in room['name']:
                furn_geom = trimesh.creation.box([0.10, 0.12, 0.07])
                furn_geom.apply_translation([rx, y + 0.06, rz - rd/4])
                meshes.append(create_mesh_with_material(furn_geom, FURNITURE_COLORS_RGB['brown'], metallic=0.2, roughness=0.8))

    # 頂樓板
    roof_geom = trimesh.creation.box([W, 0.06, D])
    roof_geom.apply_translation([0, H*8 + 0.03, 0])
    meshes.append(create_mesh_with_material(roof_geom, FLOOR_COLORS_RGB[7], metallic=0.2, roughness=0.8))

    print(f"\n✅ 建築元件數: {len(meshes)}")
    print(f"✅ 修正的房間數: {violations_fixed}")

    # 合併所有 mesh
    print("🔗 合併模型...")
    combined = trimesh.util.concatenate(meshes)

    return combined

def main():
    print("=" * 80)
    print("🏛️  赤土崎多功能館 GLB 模型生成器 - 完全修復版")
    print("=" * 80)
    print("✅ 修復 Z-Fighting（所有房間在外牆內）")
    print("✅ 移除透明度（PowerPoint 不支援）")
    print("✅ 使用 PBRMaterial 材質系統")
    print("=" * 80)

    # 生成模型
    building = create_building_fixed()

    # 保存為 GLB
    output_file = "赤土崎多功能館_修復版.glb"
    print(f"\n💾 保存 GLB 文件: {output_file}")

    building.export(output_file)

    import os
    file_size = os.path.getsize(output_file)

    print(f"\n📊 文件資訊:")
    print(f"   格式: GLB (Binary glTF)")
    print(f"   大小: {file_size / 1024:.1f} KB")
    print(f"   面片數: {len(building.faces)}")
    print(f"   頂點數: {len(building.vertices)}")

    print("\n" + "=" * 80)
    print("✨ PowerPoint 匯入步驟:")
    print(f"   1. 開啟 PowerPoint（Office 365 或 2019+）")
    print(f"   2. 插入 → 3D 模型 → 從文件")
    print(f"   3. 選擇: {output_file}")
    print(f"   4. 調整視角: 左前方俯視 45°")
    print(f"\n   🔧 修復內容:")
    print(f"   ✅ 所有房間都在外牆內部（無 Z-Fighting）")
    print(f"   ✅ 完全不透明材質（PowerPoint 兼容）")
    print(f"   ✅ 使用標準 PBRMaterial（正確渲染）")
    print(f"   ✅ 適當間距避免幾何碰撞")
    print("=" * 80)

if __name__ == "__main__":
    main()
