"""
赤土崎多功能館 3D 模型生成器 - 真實版
完全參考原始 3D 視覺化設計，真實配色和內部設備
"""

import sys
import io

# Windows 編碼修正
if sys.platform == 'win32':
    sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8', errors='replace')
    sys.stderr = io.TextIOWrapper(sys.stderr.buffer, encoding='utf-8', errors='replace')

# 比例：1 單位 = 1 公尺
SCALE = 0.2  # 縮小到 20% 以適應 PowerPoint
W = 32.0 * SCALE  # 建築寬度
D = 20.0 * SCALE  # 建築深度
H = 3.5 * SCALE   # 每層高度

# 真實樓層外牆顏色（來自原始設計）
FLOOR_WALL_COLORS = [
    (0.48, 0.48, 0.48),  # B1 - 0x7a7a7a 深灰
    (0.60, 0.60, 0.60),  # 1F - 0x9a9a9a 灰
    (0.60, 0.60, 0.60),  # 2F - 0x9a9a9a 灰
    (0.69, 0.69, 0.69),  # 3F - 0xb0b0b0 淺灰
    (0.96, 0.96, 0.96),  # 4F - 0xf5f5f5 極淺灰
    (0.96, 0.96, 0.96),  # 5F - 0xf5f5f5 極淺灰
    (0.94, 0.94, 0.94),  # 6F - 0xf0f0f0 淺灰白
    (0.91, 0.91, 0.91),  # 7F - 0xe8e8e8 灰白
]

# 房間類型顏色（來自原始設計）
ROOM_TYPE_COLORS = {
    'healthcare': (0.00, 1.00, 0.53),  # 0x00ff88 醫療 - 青綠色
    'activity': (0.00, 0.80, 1.00),    # 0x00ccff 活動 - 青藍色
    'dining': (1.00, 0.67, 0.00),      # 0xffaa00 餐飲 - 橙色
    'technical': (1.00, 0.00, 0.50),   # 0xff007f 技術 - 紫紅色
    'education': (0.40, 0.60, 1.00),   # 教育 - 藍色
    'facility': (0.60, 0.60, 0.70),    # 設施 - 灰藍
    'administrative': (0.50, 0.50, 0.50),  # 行政 - 中灰
}

# 內部分隔牆顏色
PARTITION_WALL_COLOR = (0.83, 0.83, 0.83)  # 0xd3d3d3 淺灰

# 簡化的房間數據（從原始 HTML 提取關鍵房間）
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

class RealisticBuildingOBJ:
    def __init__(self):
        self.verts = []
        self.faces = []
        self.materials = {}

    def add_material(self, name, r, g, b):
        """添加材質"""
        self.materials[name] = (r, g, b)

    def v(self, x, y, z):
        """添加頂點"""
        self.verts.append((x, y, z))
        return len(self.verts)

    def f(self, v1, v2, v3, mtl):
        """添加面"""
        self.faces.append((v1, v2, v3, mtl))

    def quad(self, v1, v2, v3, v4, mtl):
        """添加四邊形"""
        self.f(v1, v2, v3, mtl)
        self.f(v1, v3, v4, mtl)

    def box(self, x, y, z, w, h, d, mtl):
        """添加長方體"""
        v1 = self.v(x, y, z)
        v2 = self.v(x+w, y, z)
        v3 = self.v(x+w, y+h, z)
        v4 = self.v(x, y+h, z)
        v5 = self.v(x, y, z+d)
        v6 = self.v(x+w, y, z+d)
        v7 = self.v(x+w, y+h, z+d)
        v8 = self.v(x, y+h, z+d)

        # 6個面
        self.quad(v1, v2, v3, v4, mtl)  # 前
        self.quad(v6, v5, v8, v7, mtl)  # 後
        self.quad(v1, v5, v6, v2, mtl)  # 下
        self.quad(v4, v3, v7, v8, mtl)  # 上
        self.quad(v5, v1, v4, v8, mtl)  # 左
        self.quad(v2, v6, v7, v3, mtl)  # 右

    def cut_box(self, x, y, z, w, h, d, mtl):
        """四分之一切開的長方體（移除前左1/4）"""
        # 8個頂點
        v1 = self.v(x, y, z)
        v2 = self.v(x+w, y, z)
        v3 = self.v(x+w, y+h, z)
        v4 = self.v(x, y+h, z)
        v5 = self.v(x, y, z+d)
        v6 = self.v(x+w, y, z+d)
        v7 = self.v(x+w, y+h, z+d)
        v8 = self.v(x, y+h, z+d)

        # 只保留3個面：右、後、切面
        self.quad(v6, v5, v8, v7, mtl)  # 後面
        self.quad(v2, v6, v7, v3, mtl)  # 右面

        # 底面和頂面（部分）
        vm1 = self.v(x+w/2, y, z)
        vm2 = self.v(x, y, z+d/2)
        self.quad(vm1, v2, v6, v5, mtl)  # 底面右後部分
        self.quad(v1, vm1, v5, vm2, mtl)  # 底面左後部分

        vt1 = self.v(x+w/2, y+h, z)
        vt2 = self.v(x, y+h, z+d/2)
        self.quad(vt1, vt2, v8, v7, mtl)  # 頂面後部分
        self.quad(vt1, v7, v3, v3, mtl)  # 頂面右部分（退化三角形）

    def add_room(self, floor_idx, x, y, z, w, h, d, room_type, mtl):
        """添加房間（半透明盒子 + 內部分隔牆）"""
        # 房間外框（半透明）
        self.box(x, y, z, w, h, d, mtl)

        # 內部分隔牆（十字分隔）
        wall_t = 0.02
        # 縱向分隔牆
        self.box(x + w/2 - wall_t/2, y, z, wall_t, h*0.8, d, 'partition_wall')
        # 橫向分隔牆
        self.box(x, y, z + d/2 - wall_t/2, w, h*0.8, wall_t, 'partition_wall')

    def add_furniture(self, floor_idx, room_name, x, y, z, w, h, d):
        """添加家具和設備（簡化表示）"""
        # 根據房間類型添加典型家具
        item_h = 0.15  # 家具高度

        if '嬰兒' in room_name or '托嬰' in room_name:
            # 嬰兒床（白色）
            for i in range(3):
                self.box(x - w/4 + i*w/3, y, z, 0.1, item_h, 0.15, 'furniture_white')

        elif 'STEM' in room_name or '教室' in room_name:
            # 電腦桌（棕色）
            for i in range(2):
                self.box(x - w/4 + i*w/2, y, z - d/4, 0.12, item_h, 0.08, 'furniture_brown')

        elif '活動' in room_name:
            # 活動桌（棕色）
            self.box(x, y, z, w*0.6, item_h, d*0.6, 'furniture_brown')

        elif '會堂' in room_name or '展示' in room_name:
            # 座位排（深棕）
            for i in range(4):
                self.box(x - w/3, y, z - d/3 + i*d/5, w*0.6, item_h, 0.05, 'furniture_darkbrown')

    def save(self, obj_file, mtl_file):
        """保存 OBJ 和 MTL 文件"""
        # 保存 MTL
        with open(mtl_file, 'w', encoding='utf-8') as f:
            f.write("# 赤土崎多功能館 - 真實配色材質庫\n\n")
            for name, (r, g, b) in self.materials.items():
                f.write(f"newmtl {name}\n")
                f.write(f"Ka {r:.4f} {g:.4f} {b:.4f}\n")
                f.write(f"Kd {r:.4f} {g:.4f} {b:.4f}\n")

                # 半透明材質
                if 'room_' in name:
                    f.write(f"d 0.3\n")  # 30% 不透明度
                else:
                    f.write(f"d 1.0\n")

                f.write(f"Ns 25\n")
                f.write(f"\n")

        # 保存 OBJ
        with open(obj_file, 'w', encoding='utf-8') as f:
            f.write("# 赤土崎多功能館 - 真實建築模型\n")
            f.write("# 參考原始 3D 視覺化設計\n")
            f.write(f"mtllib {mtl_file}\n\n")

            # 頂點
            f.write(f"# 頂點 ({len(self.verts)}個)\n")
            for x, y, z in self.verts:
                f.write(f"v {x:.4f} {y:.4f} {z:.4f}\n")
            f.write("\n")

            # 面
            current = None
            for v1, v2, v3, mtl in self.faces:
                if mtl != current:
                    f.write(f"\nusemtl {mtl}\n")
                    current = mtl
                f.write(f"f {v1} {v2} {v3}\n")

def create_building():
    """創建真實建築模型"""
    obj = RealisticBuildingOBJ()

    print("🎨 創建真實材質庫...")

    # 樓層外牆材質
    for i, color in enumerate(FLOOR_WALL_COLORS):
        obj.add_material(f'floor_{i}_wall', *color)

    # 房間類型材質
    for room_type, color in ROOM_TYPE_COLORS.items():
        obj.add_material(f'room_{room_type}', *color)

    # 其他材質
    obj.add_material('partition_wall', *PARTITION_WALL_COLOR)
    obj.add_material('furniture_white', 1.0, 1.0, 1.0)
    obj.add_material('furniture_brown', 0.55, 0.27, 0.07)  # 0x8b4513
    obj.add_material('furniture_darkbrown', 0.41, 0.41, 0.36)

    print("🏗️  生成建築結構...")

    # 建築框架
    wall_t = 0.06

    # 外牆（四分之一切開 - 移除前左1/4）
    for floor_idx in range(8):
        y = floor_idx * H
        mtl = f'floor_{floor_idx}_wall'

        print(f"   {['B1','1F','2F','3F','4F','5F','6F','7F'][floor_idx]}: {['停車場','失智/日照','托嬰中心','跨代互動','STEM/VR','大會堂','企業展示','屋頂花園'][floor_idx]}")

        # 右側牆（完整）
        obj.box(W/2 - wall_t, y, -D/2, wall_t, H, D, mtl)

        # 後側牆（完整）
        obj.box(-W/2, y, D/2 - wall_t, W, H, wall_t, mtl)

        # 左側牆（只有後半部）
        obj.box(-W/2, y, 0, wall_t, H, D/2, mtl)

        # 前側牆（只有右半部）
        obj.box(0, y, -D/2, W/2, H, wall_t, mtl)

        # 樓板
        obj.box(-W/2, y, -D/2, W, 0.04, D, mtl)

        # 添加房間
        floor_name = ['B1','1F','2F','3F','4F','5F','6F','7F'][floor_idx]
        rooms = ROOM_DATA.get(floor_name, [])

        for room in rooms:
            room_mtl = f"room_{room['type']}"
            # 房間盒子
            obj.add_room(
                floor_idx,
                room['x'] - room['w']/2,
                y + 0.04,
                room['z'] - room['d']/2,
                room['w'],
                H * 0.85,
                room['d'],
                room['type'],
                room_mtl
            )

            # 添加家具
            obj.add_furniture(
                floor_idx,
                room['name'],
                room['x'],
                y + 0.04,
                room['z'],
                room['w'],
                H * 0.85,
                room['d']
            )

    # 頂樓板
    obj.box(-W/2, H*8, -D/2, W, 0.06, D, 'floor_7_wall')

    return obj

def main():
    print("=" * 70)
    print("🏛️  赤土崎多功能館 - 真實建築模型生成器")
    print("=" * 70)
    print("✅ 使用真實專業配色（灰色調建築）")
    print("✅ 展示內部房間和家具設備")
    print("✅ 參考原始 3D 視覺化設計")
    print("=" * 70)

    obj = create_building()

    obj_file = "赤土崎多功能館_真實版.obj"
    mtl_file = "赤土崎多功能館_真實版.mtl"

    print(f"\n💾 保存文件...")
    obj.save(obj_file, mtl_file)

    import os
    print(f"\n📊 文件資訊:")
    print(f"   OBJ: {os.path.getsize(obj_file)/1024:.1f} KB ({len(obj.verts)} 頂點, {len(obj.faces)} 面)")
    print(f"   MTL: {os.path.getsize(mtl_file)/1024:.1f} KB ({len(obj.materials)} 材質)")

    print(f"\n🎨 配色方案（參考原始設計）:")
    print(f"   外牆: 專業灰色調（深灰 → 淺灰白）")
    print(f"   醫療保健: 青綠色 (半透明)")
    print(f"   活動空間: 青藍色 (半透明)")
    print(f"   餐飲區域: 橙色 (半透明)")
    print(f"   技術機房: 紫紅色 (半透明)")
    print(f"   家具設備: 白色/棕色/深棕")

    print("\n" + "=" * 70)
    print("✨ PowerPoint 匯入步驟:")
    print(f"   1. 插入 → 3D 模型 → 從文件")
    print(f"   2. 選擇: {obj_file}")
    print(f"   3. 調整視角: 左前方俯視 45°")
    print(f"\n   💡 展示重點:")
    print(f"   - 前左1/4切開，內部完全可見")
    print(f"   - 灰色系專業建築外觀")
    print(f"   - 每層樓不同功能用半透明顏色區分")
    print(f"   - 房間內有家具和設備展示")
    print("=" * 70)

if __name__ == "__main__":
    main()
