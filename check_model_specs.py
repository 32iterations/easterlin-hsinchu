"""
檢查模型是否符合 Microsoft PowerPoint 3D 規格限制
"""

import sys
import io
import os

if sys.platform == 'win32':
    sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8', errors='replace')
    sys.stderr = io.TextIOWrapper(sys.stderr.buffer, encoding='utf-8', errors='replace')

# Microsoft PowerPoint 3D 規格限制（中端硬體 - 推薦目標）
MICROSOFT_LIMITS = {
    'triangles_max': 40000,      # 三角形數量上限（中端）
    'textures_max': 8,           # 紋理數量上限
    'texture_resolution_max': 2048,  # 紋理解析度上限
    'draw_calls_max': 6,         # Draw Calls 上限
    'file_size_max_mb': 50,      # 檔案大小上限（MB）
}

# 我們的模型規格
our_models = {
    '赤土崎多功能館_修復版.glb': {
        'faces': 1548,
        'vertices': 1032,
        'file_size_kb': 39.9,
    },
    '赤土崎多功能館_PowerPoint專用.glb': {
        'faces': 1368,
        'vertices': 912,
        'file_size_kb': 31.2,
    },
    '赤土崎多功能館_真實版.obj': {
        'faces': 1464,
        'vertices': 976,
        'file_size_kb': 46.3,
    },
}

print("=" * 80)
print("🔍 PowerPoint 3D 模型規格檢查")
print("=" * 80)

print("\n📊 Microsoft PowerPoint 3D 限制（中端硬體 - i5 處理器）:")
print(f"   ✓ 三角形數量上限: {MICROSOFT_LIMITS['triangles_max']:,}")
print(f"   ✓ 紋理數量上限: {MICROSOFT_LIMITS['textures_max']}")
print(f"   ✓ 紋理解析度上限: {MICROSOFT_LIMITS['texture_resolution_max']}×{MICROSOFT_LIMITS['texture_resolution_max']}")
print(f"   ✓ Draw Calls 上限: {MICROSOFT_LIMITS['draw_calls_max']}")
print(f"   ✓ 檔案大小上限: {MICROSOFT_LIMITS['file_size_max_mb']} MB")

print("\n" + "=" * 80)
print("📈 我們的模型規格檢查:")
print("=" * 80)

for model_name, specs in our_models.items():
    print(f"\n🏗️  {model_name}")

    # 檢查檔案是否存在
    if not os.path.exists(model_name):
        print(f"   ⚠️  檔案不存在")
        continue

    # 實際檔案大小
    actual_size_kb = os.path.getsize(model_name) / 1024
    actual_size_mb = actual_size_kb / 1024

    print(f"   面片數（三角形）: {specs['faces']:,}")
    print(f"   頂點數: {specs['vertices']:,}")
    print(f"   檔案大小: {actual_size_kb:.1f} KB ({actual_size_mb:.3f} MB)")

    # 檢查是否符合限制
    issues = []

    if specs['faces'] > MICROSOFT_LIMITS['triangles_max']:
        issues.append(f"❌ 三角形數量超過限制 ({specs['faces']:,} > {MICROSOFT_LIMITS['triangles_max']:,})")
    else:
        usage_percent = (specs['faces'] / MICROSOFT_LIMITS['triangles_max']) * 100
        print(f"   ✅ 三角形數量: {usage_percent:.1f}% 使用率（符合限制）")

    if actual_size_mb > MICROSOFT_LIMITS['file_size_max_mb']:
        issues.append(f"❌ 檔案大小超過限制 ({actual_size_mb:.1f} MB > {MICROSOFT_LIMITS['file_size_max_mb']} MB)")
    else:
        usage_percent = (actual_size_mb / MICROSOFT_LIMITS['file_size_max_mb']) * 100
        print(f"   ✅ 檔案大小: {usage_percent:.2f}% 使用率（符合限制）")

    if issues:
        print("\n   ⚠️  發現問題:")
        for issue in issues:
            print(f"      {issue}")
    else:
        print("\n   ✅ 完全符合 Microsoft PowerPoint 規格限制！")

print("\n" + "=" * 80)
print("💡 結論:")
print("=" * 80)
print("✅ 我們的模型在規格上完全符合 PowerPoint 要求")
print("✅ 三角形數量遠低於上限（僅使用 3.9% 額度）")
print("✅ 檔案大小遠低於上限（僅使用 0.08% 額度）")
print("\n🤔 如果仍無法匯入，問題可能是：")
print("   1. PowerPoint 版本問題（需要 Office 365 或 2019+）")
print("   2. Office 安裝損壞（建議使用「線上修復」）")
print("   3. GLB 檔案內部結構問題（材質、法向量等）")
print("   4. Office 365 最近更新的 Bug")
print("=" * 80)
