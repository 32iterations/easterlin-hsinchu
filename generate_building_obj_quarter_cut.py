"""
赤土崎多功能館 3D OBJ 模型生成器（四分之一切開版）
移除前左四分之一，徹底展示內部規劃
"""

import sys
import io

# Windows 編碼修正
if sys.platform == 'win32':
    sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8', errors='replace')
    sys.stderr = io.TextIOWrapper(sys.stderr.buffer, encoding='utf-8', errors='replace')

# 建築參數（使用合適的比例）
SCALE = 0.15  # 放大一點以便觀察
W = 28.0 * SCALE  # 寬度 4.2 單位
D = 24.0 * SCALE  # 深度 3.6 單位
H = 3.5 * SCALE   # 每層高 0.525 單位

# 樓層顏色和功能
FLOORS = [
    {'name': 'B1', 'color': (0.4, 0.4, 0.4), 'label': '停車場'},
    {'name': '1F', 'color': (1.0, 0.3, 0.3), 'label': '失智症/日照'},
    {'name': '2F', 'color': (1.0, 0.6, 0.2), 'label': '托嬰中心'},
    {'name': '3F', 'color': (1.0, 0.9, 0.2), 'label': '青少年/VR'},
    {'name': '4F', 'color': (0.3, 1.0, 0.3), 'label': 'STEM教室'},
    {'name': '5F', 'color': (0.3, 0.6, 1.0), 'label': '時間銀行'},
    {'name': '6F', 'color': (0.6, 0.3, 1.0), 'label': 'AI記憶銀行'},
    {'name': '7F', 'color': (1.0, 0.3, 0.8), 'label': '太陽能/ESG'},
]

class SimpleOBJ:
    def __init__(self):
        self.verts = []
        self.faces = []
        self.materials = {}
        self.mtl_file = None

    def add_mtl(self, name, r, g, b):
        self.materials[name] = (r, g, b)

    def v(self, x, y, z):
        """添加頂點，返回索引（從1開始）"""
        self.verts.append((x, y, z))
        return len(self.verts)

    def f(self, v1, v2, v3, mtl):
        """添加面"""
        self.faces.append((v1, v2, v3, mtl))

    def quad(self, v1, v2, v3, v4, mtl):
        """添加四邊形"""
        self.f(v1, v2, v3, mtl)
        self.f(v1, v3, v4, mtl)

    def box(self, x, y, z, w, h, d, mtl, cut_front_left=False):
        """
        添加長方體
        cut_front_left: 是否切掉前左四分之一
        """
        # 8個頂點
        v1 = self.v(x, y, z)
        v2 = self.v(x+w, y, z)
        v3 = self.v(x+w, y+h, z)
        v4 = self.v(x, y+h, z)
        v5 = self.v(x, y, z+d)
        v6 = self.v(x+w, y, z+d)
        v7 = self.v(x+w, y+h, z+d)
        v8 = self.v(x, y+h, z+d)

        if cut_front_left:
            # 只保留右半和後半的面
            # 右側面
            self.quad(v2, v6, v7, v3, mtl)
            # 後側面
            self.quad(v6, v5, v8, v7, mtl)
            # 底面（右後四分之一）
            vm1 = self.v(x+w/2, y, z)
            vm2 = self.v(x+w/2, y, z+d)
            vm3 = self.v(x+w, y, z+d/2)
            self.quad(vm1, v2, v6, vm2, mtl)
            self.quad(vm2, v6, v5, vm3, mtl)
            # 頂面（右後四分之一）
            vt1 = self.v(x+w/2, y+h, z)
            vt2 = self.v(x+w/2, y+h, z+d)
            vt3 = self.v(x+w, y+h, z+d/2)
            self.quad(vt1, vt2, v7, v3, mtl)
            self.quad(vt2, vt3, v7, v7, mtl)
        else:
            # 完整6個面
            self.quad(v1, v2, v3, v4, mtl)  # 前
            self.quad(v6, v5, v8, v7, mtl)  # 後
            self.quad(v1, v5, v6, v2, mtl)  # 下
            self.quad(v4, v3, v7, v8, mtl)  # 上
            self.quad(v5, v1, v4, v8, mtl)  # 左
            self.quad(v2, v6, v7, v3, mtl)  # 右

    def slab(self, floor_idx, y, mtl):
        """
        創建樓板（四分之一切開）
        只保留右後3/4部分
        """
        thickness = 0.02
        # 完整樓板分為4部分，只創建右後3部分

        # 右後部分
        self.box(0, y, 0, W/2, thickness, D/2, mtl)

        # 左後部分
        self.box(-W/2, y, 0, W/2, thickness, D/2, mtl)

        # 右前部分
        self.box(0, y, -D/2, W/2, thickness, D/2, mtl)

    def room_walls(self, floor_idx, y_base, mtl):
        """創建房間隔牆（顏色與樓層相同）"""
        wall_h = H * 0.75  # 牆高為樓層高的75%
        thin = 0.015

        # 中央縱向分隔牆（分左右區）
        self.box(-0.05, y_base+0.02, -D/2, 0.1, wall_h, D, mtl)

        # 前後橫向分隔牆（分前後區）
        self.box(-W/2, y_base+0.02, -0.05, W, wall_h, 0.1, mtl)

        # 左側額外房間分隔（展示更多細節）
        if floor_idx >= 1:  # 1F 以上
            self.box(-W/2, y_base+0.02, D/4, thin, wall_h, D/4, mtl)
            self.box(W/4, y_base+0.02, -D/2, thin, wall_h, D/2, mtl)

    def save(self, obj_name, mtl_name):
        self.mtl_file = mtl_name

        # 保存 MTL
        with open(mtl_name, 'w', encoding='utf-8') as f:
            f.write("# 赤土崎多功能館材質文件\n\n")
            for name, (r, g, b) in self.materials.items():
                f.write(f"newmtl {name}\n")
                f.write(f"Ka {r:.3f} {g:.3f} {b:.3f}\n")
                f.write(f"Kd {r:.3f} {g:.3f} {b:.3f}\n")
                f.write(f"Ks 0.3 0.3 0.3\n")
                f.write(f"Ns 20\n")
                f.write(f"d 1.0\n\n")

        # 保存 OBJ
        with open(obj_name, 'w', encoding='utf-8') as f:
            f.write("# 赤土崎多功能館 - 四分之一切開展示版\n")
            f.write("# 前左四分之一移除，清楚展示內部8層規劃\n")
            f.write(f"mtllib {mtl_name}\n\n")

            # 頂點
            f.write(f"# 頂點 ({len(self.verts)}個)\n")
            for x, y, z in self.verts:
                f.write(f"v {x:.4f} {y:.4f} {z:.4f}\n")
            f.write("\n")

            # 面（按材質分組）
            current = None
            for v1, v2, v3, mtl in self.faces:
                if mtl != current:
                    f.write(f"\nusemtl {mtl}\n")
                    current = mtl
                f.write(f"f {v1} {v2} {v3}\n")

def create_building():
    """創建四分之一切開的建築"""
    obj = SimpleOBJ()

    print("🎨 創建材質...")
    # 添加材質
    for floor in FLOORS:
        obj.add_mtl(f"floor_{floor['name']}", *floor['color'])
    obj.add_mtl("wall", 0.85, 0.85, 0.85)

    print("🏗️  生成建築...")

    # 1. 外牆框架（四分之一切開）
    print("   📐 外牆框架...")
    total_h = H * 8

    # 右側外牆
    obj.box(W/2-0.02, 0, -D/2, 0.02, total_h, D, 'wall')

    # 後側外牆
    obj.box(-W/2, 0, D/2-0.02, W, total_h, 0.02, 'wall')

    # 左側外牆（只有後半部分）
    obj.box(-W/2, 0, 0, 0.02, total_h, D/2, 'wall')

    # 前側外牆（只有右半部分）
    obj.box(0, 0, -D/2, W/2, total_h, 0.02, 'wall')

    # 2. 樓板和房間（每層不同顏色）
    print("   🏢 樓板和房間...")
    for i, floor in enumerate(FLOORS):
        y = i * H
        mtl = f"floor_{floor['name']}"

        print(f"      {floor['name']}: {floor['label']}")

        # 樓板（四分之一切開）
        obj.slab(i, y, mtl)

        # 房間隔牆
        if i > 0:  # 1F 以上才有房間
            obj.room_walls(i, y, mtl)

    # 3. 頂樓板
    print("   🏠 頂樓板...")
    obj.slab(8, H*8, 'wall')

    return obj

def main():
    print("=" * 70)
    print("🏛️  赤土崎多功能館 - 四分之一切開彩色展示版")
    print("=" * 70)

    obj = create_building()

    obj_file = "赤土崎多功能館_四分之一切開.obj"
    mtl_file = "赤土崎多功能館_四分之一切開.mtl"

    print(f"\n💾 保存文件...")
    obj.save(obj_file, mtl_file)

    import os
    print(f"\n📊 文件信息:")
    print(f"   OBJ: {os.path.getsize(obj_file)/1024:.1f} KB ({len(obj.verts)} 頂點, {len(obj.faces)} 面)")
    print(f"   MTL: {os.path.getsize(mtl_file)/1024:.1f} KB ({len(obj.materials)} 材質)")

    print(f"\n🎨 樓層顏色圖例:")
    for floor in FLOORS:
        r, g, b = floor['color']
        print(f"   {floor['name']}: {floor['label']:12s} RGB({r:.1f}, {g:.1f}, {b:.1f})")

    print("\n" + "=" * 70)
    print("✨ 完成！PowerPoint 匯入指南：")
    print(f"\n   📥 步驟:")
    print(f"   1. 插入 → 3D 模型 → 從文件")
    print(f"   2. 選擇: {obj_file}")
    print(f"\n   🎯 最佳視角:")
    print(f"   - 從**左前方**看（切面朝向你）")
    print(f"   - 俯視 30-45 度")
    print(f"   - 可清楚看到所有 8 層樓的顏色和內部隔間")
    print(f"\n   💡 展示重點:")
    print(f"   - 每層樓有不同顏色，一目了然")
    print(f"   - 切面徹底展示內部空間規劃")
    print(f"   - 房間分隔清晰可見")
    print(f"   - 簡報時可旋轉模型動態展示")
    print("=" * 70)

if __name__ == "__main__":
    main()
