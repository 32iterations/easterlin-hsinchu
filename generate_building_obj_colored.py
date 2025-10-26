"""
赤土崎多功能館 3D OBJ 模型生成器（帶顏色、對角切面）
生成可嵌入 PowerPoint 的 .obj + .mtl 文件（支持顏色）
"""

import sys
import io
import numpy as np

# Windows 編碼修正
if sys.platform == 'win32':
    sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8', errors='replace')
    sys.stderr = io.TextIOWrapper(sys.stderr.buffer, encoding='utf-8', errors='replace')

# 建築參數（使用 1:10 比例，1 單位 = 10 公尺）
SCALE = 0.1
BUILDING_WIDTH = 28.0 * SCALE   # 2.8 單位
BUILDING_DEPTH = 24.0 * SCALE   # 2.4 單位
FLOOR_HEIGHT = 3.5 * SCALE      # 0.35 單位
WALL_THICKNESS = 0.15 * SCALE   # 0.015 單位

# 樓層顏色配置（RGB 0-1）
FLOOR_COLORS = {
    'B1': (0.5, 0.5, 0.5),      # 灰色 - 停車場
    '1F': (0.8, 0.4, 0.4),      # 紅色 - 失智症專區
    '2F': (1.0, 0.7, 0.4),      # 橙色 - 托嬰中心
    '3F': (1.0, 1.0, 0.4),      # 黃色 - 青少年活動
    '4F': (0.4, 1.0, 0.4),      # 綠色 - STEM教室
    '5F': (0.4, 0.7, 1.0),      # 藍色 - 時間銀行
    '6F': (0.7, 0.4, 1.0),      # 紫色 - 記憶銀行
    '7F': (1.0, 0.4, 0.7),      # 粉色 - 太陽能/ESG
    'exterior': (0.9, 0.9, 0.9), # 淺灰 - 外牆
    'slab': (0.7, 0.7, 0.7),    # 深灰 - 樓板
}

# 簡化房間數據（每層重點房間）
ROOM_DATA = {
    'B1': [
        {'name': '停車場', 'x': 0, 'z': 0, 'w': 2.4, 'd': 2.0},
    ],
    '1F': [
        {'name': '失智症專區', 'x': -0.7, 'z': 0, 'w': 1.0, 'd': 1.2},
        {'name': '日照中心', 'x': 0.5, 'z': 0, 'w': 0.9, 'd': 1.2},
    ],
    '2F': [
        {'name': '托嬰中心', 'x': -0.7, 'z': 0, 'w': 1.0, 'd': 1.2},
        {'name': '親子共學', 'x': 0.5, 'z': 0, 'w': 0.9, 'd': 1.2},
    ],
    '3F': [
        {'name': '青少年活動室', 'x': -0.7, 'z': 0, 'w': 1.0, 'd': 1.2},
        {'name': 'VR教室', 'x': 0.5, 'z': 0, 'w': 0.9, 'd': 1.2},
    ],
    '4F': [
        {'name': 'STEM教室', 'x': -0.7, 'z': 0, 'w': 1.0, 'd': 1.2},
        {'name': '創客空間', 'x': 0.5, 'z': 0, 'w': 0.9, 'd': 1.2},
    ],
    '5F': [
        {'name': '時間銀行', 'x': -0.7, 'z': 0, 'w': 1.0, 'd': 1.2},
        {'name': '志工培訓', 'x': 0.5, 'z': 0, 'w': 0.9, 'd': 1.2},
    ],
    '6F': [
        {'name': '記憶銀行', 'x': -0.7, 'z': 0, 'w': 1.0, 'd': 1.2},
        {'name': 'AI互動區', 'x': 0.5, 'z': 0, 'w': 0.9, 'd': 1.2},
    ],
    '7F': [
        {'name': '太陽能', 'x': -0.7, 'z': 0, 'w': 1.0, 'd': 1.2},
        {'name': 'ESG展示', 'x': 0.5, 'z': 0, 'w': 0.9, 'd': 1.2},
    ],
}

class OBJBuilder:
    def __init__(self):
        self.vertices = []  # 頂點列表
        self.faces = []     # 面列表 [(v1, v2, v3, material), ...]
        self.materials = {} # 材質字典
        self.current_material = None

    def add_vertex(self, x, y, z):
        """添加頂點，返回索引（OBJ 格式從 1 開始）"""
        self.vertices.append((x, y, z))
        return len(self.vertices)

    def add_material(self, name, r, g, b):
        """添加材質"""
        self.materials[name] = (r, g, b)

    def set_material(self, name):
        """設置當前材質"""
        self.current_material = name

    def add_face(self, v1, v2, v3):
        """添加三角面（使用當前材質）"""
        self.faces.append((v1, v2, v3, self.current_material))

    def add_quad(self, v1, v2, v3, v4):
        """添加四邊形（分解為兩個三角形）"""
        self.add_face(v1, v2, v3)
        self.add_face(v1, v3, v4)

    def add_box(self, x, y, z, w, h, d, material):
        """添加長方體（對角切面優化）"""
        self.set_material(material)

        # 8 個頂點
        v1 = self.add_vertex(x, y, z)
        v2 = self.add_vertex(x + w, y, z)
        v3 = self.add_vertex(x + w, y + h, z)
        v4 = self.add_vertex(x, y + h, z)
        v5 = self.add_vertex(x, y, z + d)
        v6 = self.add_vertex(x + w, y, z + d)
        v7 = self.add_vertex(x + w, y + h, z + d)
        v8 = self.add_vertex(x, y + h, z + d)

        # 對角切面：只顯示後半部分和右半部分
        # 切面線：從左前 (x, z) 到右後 (x+w, z+d)

        # 判斷是否在切面前方（隱藏）或後方（顯示）
        # 簡化：只顯示 x > 0 或 z > 0 的部分

        # 前面 (z 軸負方向) - 只顯示右半邊
        if x + w/2 > 0:
            self.add_quad(v1, v2, v3, v4)

        # 後面 (z 軸正方向) - 完整顯示
        self.add_quad(v6, v5, v8, v7)

        # 左面 (x 軸負方向) - 只顯示後半邊
        if z + d/2 > 0:
            self.add_quad(v5, v1, v4, v8)

        # 右面 (x 軸正方向) - 完整顯示
        self.add_quad(v2, v6, v7, v3)

        # 底面和頂面 - 完整顯示
        self.add_quad(v1, v5, v6, v2)  # 底面
        self.add_quad(v4, v3, v7, v8)  # 頂面

    def save(self, obj_filename, mtl_filename):
        """保存為 OBJ 和 MTL 文件"""
        # 寫入 MTL 文件
        with open(mtl_filename, 'w', encoding='utf-8') as f:
            for name, (r, g, b) in self.materials.items():
                f.write(f"newmtl {name}\n")
                f.write(f"Ka {r} {g} {b}\n")  # 環境光
                f.write(f"Kd {r} {g} {b}\n")  # 漫射光
                f.write(f"Ks 0.5 0.5 0.5\n")  # 鏡面光
                f.write(f"Ns 32\n")            # 光澤度
                f.write(f"d 1.0\n")            # 透明度
                f.write(f"\n")

        # 寫入 OBJ 文件
        with open(obj_filename, 'w', encoding='utf-8') as f:
            f.write(f"# 赤土崎多功能館 3D 模型\n")
            f.write(f"# 對角切面展示版（帶顏色標示）\n")
            f.write(f"mtllib {mtl_filename}\n\n")

            # 寫入頂點
            f.write(f"# 頂點 ({len(self.vertices)} 個)\n")
            for x, y, z in self.vertices:
                f.write(f"v {x:.4f} {y:.4f} {z:.4f}\n")
            f.write("\n")

            # 寫入面（按材質分組）
            current_mat = None
            for v1, v2, v3, mat in self.faces:
                if mat != current_mat:
                    f.write(f"\nusemtl {mat}\n")
                    current_mat = mat
                f.write(f"f {v1} {v2} {v3}\n")

def create_colored_building():
    """創建帶顏色的建築模型（對角切面）"""
    builder = OBJBuilder()

    print("🎨 創建材質...")
    # 添加所有材質
    for floor_name, color in FLOOR_COLORS.items():
        builder.add_material(f"mat_{floor_name}", *color)

    print("🏗️  生成建築結構...")

    # 1. 外牆（對角切開）
    print("   📐 外牆...")
    # 只保留後半部分和右半部分的外牆

    # 右側牆
    builder.add_box(
        BUILDING_WIDTH/2 - WALL_THICKNESS, 0, -BUILDING_DEPTH/2,
        WALL_THICKNESS, FLOOR_HEIGHT * 8, BUILDING_DEPTH,
        'mat_exterior'
    )

    # 後側牆
    builder.add_box(
        -BUILDING_WIDTH/2, 0, BUILDING_DEPTH/2 - WALL_THICKNESS,
        BUILDING_WIDTH, FLOOR_HEIGHT * 8, WALL_THICKNESS,
        'mat_exterior'
    )

    # 2. 樓板（每層不同顏色）
    print("   🏢 樓板...")
    floor_names = ['B1', '1F', '2F', '3F', '4F', '5F', '6F', '7F']
    for i, floor_name in enumerate(floor_names):
        y = i * FLOOR_HEIGHT
        builder.add_box(
            -BUILDING_WIDTH/2, y, -BUILDING_DEPTH/2,
            BUILDING_WIDTH, 0.02, BUILDING_DEPTH,
            f'mat_{floor_name}'
        )

    # 3. 房間隔牆（每層使用該層顏色）
    print("   🚪 房間隔牆...")
    for i, (floor_name, rooms) in enumerate(ROOM_DATA.items()):
        y_base = i * FLOOR_HEIGHT

        for room in rooms:
            x, z, w, d = room['x'], room['z'], room['w'], room['d']

            # 房間四周薄牆（高度降低以便看到內部）
            wall_h = FLOOR_HEIGHT * 0.8  # 80% 高度
            thin = 0.02

            # 左牆
            builder.add_box(
                x - w/2, y_base + 0.02, z - d/2,
                thin, wall_h, d,
                f'mat_{floor_name}'
            )

            # 右牆
            builder.add_box(
                x + w/2 - thin, y_base + 0.02, z - d/2,
                thin, wall_h, d,
                f'mat_{floor_name}'
            )

            # 前牆
            builder.add_box(
                x - w/2, y_base + 0.02, z - d/2,
                w, wall_h, thin,
                f'mat_{floor_name}'
            )

            # 後牆
            builder.add_box(
                x - w/2, y_base + 0.02, z + d/2 - thin,
                w, wall_h, thin,
                f'mat_{floor_name}'
            )

    # 4. 屋頂
    print("   🏠 屋頂...")
    builder.add_box(
        -BUILDING_WIDTH/2, FLOOR_HEIGHT * 8, -BUILDING_DEPTH/2,
        BUILDING_WIDTH, 0.03, BUILDING_DEPTH,
        'mat_exterior'
    )

    return builder

def main():
    print("=" * 70)
    print("🏛️  赤土崎多功能館 3D 彩色模型生成器（對角切面版）")
    print("=" * 70)

    builder = create_colored_building()

    obj_file = "赤土崎多功能館_彩色對角切面.obj"
    mtl_file = "赤土崎多功能館_彩色對角切面.mtl"

    print(f"\n💾 保存文件...")
    print(f"   OBJ: {obj_file}")
    print(f"   MTL: {mtl_file}")

    builder.save(obj_file, mtl_file)

    import os
    obj_size = os.path.getsize(obj_file)
    mtl_size = os.path.getsize(mtl_file)

    print(f"\n📊 統計:")
    print(f"   頂點數: {len(builder.vertices)}")
    print(f"   面片數: {len(builder.faces)}")
    print(f"   材質數: {len(builder.materials)}")
    print(f"   OBJ 大小: {obj_size / 1024:.2f} KB")
    print(f"   MTL 大小: {mtl_size / 1024:.2f} KB")

    print("\n🎨 樓層顏色配置:")
    for floor, color in FLOOR_COLORS.items():
        if floor not in ['exterior', 'slab']:
            print(f"   {floor}: RGB{color}")

    print("\n" + "=" * 70)
    print("✨ 完成！PowerPoint 匯入步驟：")
    print(f"\n   1. 插入 → 3D 模型 → 從文件")
    print(f"   2. 選擇: {obj_file}")
    print(f"   3. PowerPoint 會自動讀取顏色配置")
    print(f"\n   💡 展示角度建議：")
    print(f"   - 從左前方俯視 45°（切面朝向觀眾）")
    print(f"   - 可清楚看到 8 層樓的顏色區分")
    print(f"   - 每層樓有不同顏色，方便識別功能")
    print(f"   - 房間隔牆清晰展示空間規劃")
    print("=" * 70)

if __name__ == "__main__":
    main()
