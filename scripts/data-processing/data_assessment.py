#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
数据品质评估脚本
"""
import json
from collections import Counter, defaultdict

def assess_data_quality(input_file='structured_data.json'):
    """评估数据品质"""

    with open(input_file, 'r', encoding='utf-8') as f:
        data = json.load(f)

    print("="*60)
    print("数据品质评估报告")
    print("="*60)

    # 基本统计
    print(f"\n总文章数: {len(data)}")
    print(f"字段列表: {list(data[0].keys())}")

    # 检查重复标题
    titles = [d['title'] for d in data]
    title_counts = Counter(titles)
    duplicates = {title: count for title, count in title_counts.items() if count > 1}

    print(f"\n重复标题数: {len(duplicates)}")
    if duplicates:
        print("重复标题列表:")
        for title, count in list(duplicates.items())[:5]:
            print(f"  - {title}: {count}次")

    # 检查日期格式
    dates = [d['date'] for d in data]
    date_formats = defaultdict(int)
    for date in dates:
        if '-' in date and len(date) == 10:
            date_formats['YYYY-MM-DD'] += 1
        else:
            date_formats['其他格式'] += 1

    print(f"\n日期格式分布:")
    for fmt, count in date_formats.items():
        print(f"  {fmt}: {count}")

    # 检查来源类型
    source_types = Counter([d['source_type'] for d in data])
    print(f"\n来源类型分布:")
    for source, count in source_types.most_common():
        print(f"  {source}: {count}")

    # 检查主题分布
    all_topics = []
    for d in data:
        all_topics.extend(d['topics'])
    topic_counts = Counter(all_topics)

    print(f"\n主题分布 (Top 5):")
    for topic, count in topic_counts.most_common(5):
        print(f"  {topic}: {count}")

    # 检查内容长度
    content_lengths = [len(d['content']) for d in data]
    avg_length = sum(content_lengths) / len(content_lengths)
    print(f"\n内容平均长度: {avg_length:.0f} 字符")
    print(f"最短内容: {min(content_lengths)} 字符")
    print(f"最长内容: {max(content_lengths)} 字符")

    # 检查关键词数量
    keyword_counts = [len(d['keywords']) for d in data]
    print(f"\n平均关键词数: {sum(keyword_counts)/len(keyword_counts):.1f}")

    print("\n" + "="*60)

    return data, duplicates

if __name__ == '__main__':
    data, duplicates = assess_data_quality()
