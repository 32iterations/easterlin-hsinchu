#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
竹科家庭生活痛點資料處理腳本
處理 HTML 和 Markdown 檔案，提取結構化資訊並生成分析報告
"""

import os
import re
import json
import csv
from datetime import datetime
from pathlib import Path
from collections import Counter, defaultdict
from typing import List, Dict, Optional

from bs4 import BeautifulSoup
import jieba
import jieba.analyse


class ArticleProcessor:
    """文章處理器"""

    # 主題分類關鍵詞
    TOPIC_KEYWORDS = {
        '托育/教育壓力': [
            '托育', '教育', '學校', '補習', '才藝', '課程', '學習', '成績',
            '考試', '安親班', '幼兒園', '國小', '國中', '高中', '鋼琴',
            '英文', '數學', '家教', '教養', '孩子', '小孩', '兒童'
        ],
        '長照/失智照護': [
            '長照', '失智', '照護', '老人', '長輩', '父母', '公婆',
            '岳父母', '養老', '安養', '看護', '醫療'
        ],
        '工作-家庭平衡': [
            '加班', '工時', '輪班', '值班', '工作壓力', '職場', '陪伴',
            '相處', '晚餐', '週末', '假日', '下班', '夜班', '責任制',
            '工程師', '竹科', '園區'
        ],
        '跨縣市通勤': [
            '通勤', '交通', '台北', '北漂', '搬家', '移居', '高鐵',
            '火車', '開車', '塞車', '距離'
        ],
        '社群焦慮/教養競爭': [
            '群組', '媽媽群', '家長群', '社群', '比較', '競爭', '焦慮',
            '壓力', '門檻', '高端', '名牌', '炫耀', 'Line群', 'FB',
            '雙B', '名牌包'
        ],
        '財務壓力': [
            '房價', '房貸', '租金', '物價', '消費', '貧戶', '經濟',
            '薪水', '收入', '開銷', '支出', '生活費', '學費', '錢',
            '財務', '負擔', '儲蓄', '貸款'
        ],
        '生活品質': [
            '風大', '天氣', '環境', '生活機能', '娛樂', '休閒', '美食',
            '餐廳', '百貨', '購物', '公園', '設施', '交通', '缺點',
            '優點', '便利'
        ]
    }

    # 來源類型判斷
    SOURCE_TYPES = {
        '新聞': ['風傳媒', 'ETtoday', '聯合新聞網', '鏡週刊'],
        '社群': ['Mobile01', 'PTT', 'Dcard'],
        '政府': ['政府', '衛福部', '內政部', '教育部'],
        '學術': ['研究', '論文', '期刊'],
        '個人': ['投書', 'FB', '部落格', '詼詼學姊']
    }

    def __init__(self, base_dir: str):
        self.base_dir = Path(base_dir)
        self.articles = []

        # 初始化 jieba 分詞
        jieba.initialize()

    def extract_from_html(self, file_path: Path) -> Optional[Dict]:
        """從 HTML 檔案提取資訊"""
        try:
            with open(file_path, 'r', encoding='utf-8', errors='ignore') as f:
                content = f.read()

            soup = BeautifulSoup(content, 'html.parser')

            # 移除 script 和 style 標籤
            for script in soup(['script', 'style', 'nav', 'header', 'footer', 'aside']):
                script.decompose()

            # 提取標題
            title = self._extract_title(soup, file_path)

            # 提取日期
            date = self._extract_date(soup, file_path)

            # 判斷來源類型
            source_type = self._determine_source_type(title, str(file_path))

            # 提取內文
            article_content = self._extract_content(soup, source_type)

            # 提取關鍵詞
            keywords = self._extract_keywords(title + ' ' + article_content)

            # 分類主題
            topics = self._classify_topics(title + ' ' + article_content)

            return {
                'title': title,
                'date': date,
                'source_type': source_type,
                'source_file': file_path.name,
                'content': article_content[:2000],  # 限制長度
                'keywords': keywords,
                'topics': topics
            }

        except Exception as e:
            print(f"Error processing {file_path}: {e}")
            return None

    def extract_from_markdown(self, file_path: Path) -> Optional[Dict]:
        """從 Markdown 檔案提取資訊"""
        try:
            with open(file_path, 'r', encoding='utf-8') as f:
                content = f.read()

            # 提取標題（第一行或檔案名）
            lines = content.strip().split('\n')
            title = lines[0] if lines else file_path.stem
            title = title.strip('#').strip()

            # 從檔案修改時間推斷日期
            mtime = os.path.getmtime(file_path)
            date = datetime.fromtimestamp(mtime).strftime('%Y-%m-%d')

            # 來源類型
            source_type = '個人'

            # 內文
            article_content = '\n'.join(lines)

            # 提取關鍵詞
            keywords = self._extract_keywords(content)

            # 分類主題
            topics = self._classify_topics(content)

            return {
                'title': title,
                'date': date,
                'source_type': source_type,
                'source_file': file_path.name,
                'content': article_content[:2000],
                'keywords': keywords,
                'topics': topics
            }

        except Exception as e:
            print(f"Error processing {file_path}: {e}")
            return None

    def _extract_title(self, soup: BeautifulSoup, file_path: Path) -> str:
        """提取標題"""
        # 嘗試從 <title> 標籤提取
        title_tag = soup.find('title')
        if title_tag:
            title = title_tag.get_text().strip()
            # 清理標題（移除網站名稱等）
            title = re.split(r'[_\-–|｜]', title)[0].strip()
            if title:
                return title

        # 嘗試從 meta 標籤提取
        og_title = soup.find('meta', property='og:title')
        if og_title and og_title.get('content'):
            return og_title['content'].strip()

        # 嘗試從 h1 標籤提取
        h1 = soup.find('h1')
        if h1:
            return h1.get_text().strip()

        # 使用檔案名作為標題
        return file_path.stem

    def _extract_date(self, soup: BeautifulSoup, file_path: Path) -> str:
        """提取日期"""
        # 嘗試從 meta 標籤提取
        date_patterns = [
            ('meta', {'property': 'article:published_time'}),
            ('meta', {'name': 'pubdate'}),
            ('meta', {'name': 'date'}),
            ('time', {}),
        ]

        for tag, attrs in date_patterns:
            element = soup.find(tag, attrs)
            if element:
                date_str = element.get('content') or element.get('datetime') or element.get_text()
                if date_str:
                    # 嘗試解析日期
                    parsed_date = self._parse_date(date_str)
                    if parsed_date:
                        return parsed_date

        # 從檔案修改時間推斷
        mtime = os.path.getmtime(file_path)
        return datetime.fromtimestamp(mtime).strftime('%Y-%m-%d')

    def _parse_date(self, date_str: str) -> Optional[str]:
        """解析日期字串"""
        date_formats = [
            '%Y-%m-%d',
            '%Y-%m-%dT%H:%M:%S',
            '%Y-%m-%dT%H:%M:%S%z',
            '%Y-%m-%dT%H:%M:%S.%f%z',
            '%Y/%m/%d',
            '%Y年%m月%d日',
        ]

        for fmt in date_formats:
            try:
                dt = datetime.strptime(date_str[:19], fmt[:19])
                return dt.strftime('%Y-%m-%d')
            except:
                continue

        # 嘗試提取年月日數字
        match = re.search(r'(\d{4})[-/年](\d{1,2})[-/月](\d{1,2})', date_str)
        if match:
            return f"{match.group(1)}-{match.group(2).zfill(2)}-{match.group(3).zfill(2)}"

        return None

    def _determine_source_type(self, title: str, file_path: str) -> str:
        """判斷來源類型"""
        text = title + ' ' + file_path

        for source_type, keywords in self.SOURCE_TYPES.items():
            if any(keyword in text for keyword in keywords):
                return source_type

        return '其他'

    def _extract_content(self, soup: BeautifulSoup, source_type: str) -> str:
        """提取內文"""
        # 根據不同來源使用不同的選擇器
        content_selectors = [
            ('article', {}),
            ('div', {'class': re.compile(r'article|content|post|entry')}),
            ('div', {'id': re.compile(r'article|content|post|entry')}),
            ('main', {}),
        ]

        for tag, attrs in content_selectors:
            content_div = soup.find(tag, attrs)
            if content_div:
                # 提取文字，保留段落結構
                paragraphs = []
                for p in content_div.find_all(['p', 'div', 'li']):
                    text = p.get_text().strip()
                    if len(text) > 20:  # 過濾太短的段落
                        paragraphs.append(text)

                if paragraphs:
                    return '\n'.join(paragraphs)

        # 如果找不到，就提取所有文字
        text = soup.get_text()
        # 清理多餘的空白
        text = re.sub(r'\s+', ' ', text)
        return text.strip()

    def _extract_keywords(self, text: str, topK: int = 10) -> List[str]:
        """使用 jieba 提取關鍵詞"""
        try:
            # 使用 TF-IDF 提取關鍵詞
            keywords = jieba.analyse.extract_tags(text, topK=topK, withWeight=False)
            return keywords
        except:
            # 如果失敗，使用簡單的詞頻統計
            words = jieba.cut(text)
            # 過濾停用詞和單字詞
            words = [w for w in words if len(w) > 1 and w.strip()]
            counter = Counter(words)
            return [word for word, _ in counter.most_common(topK)]

    def _classify_topics(self, text: str) -> List[str]:
        """分類主題"""
        topics = []

        for topic, keywords in self.TOPIC_KEYWORDS.items():
            # 計算匹配的關鍵詞數量
            matches = sum(1 for keyword in keywords if keyword in text)
            if matches >= 2:  # 至少匹配 2 個關鍵詞
                topics.append(topic)

        return topics if topics else ['其他']

    def process_all_files(self):
        """處理所有檔案"""
        print("開始處理檔案...")

        # 處理 HTML 檔案
        html_files = list(self.base_dir.glob('*.html'))
        print(f"找到 {len(html_files)} 個 HTML 檔案")

        for i, file_path in enumerate(html_files, 1):
            print(f"處理 HTML 檔案 ({i}/{len(html_files)}): {file_path.name}")
            article = self.extract_from_html(file_path)
            if article:
                self.articles.append(article)

        # 處理 Markdown 檔案
        md_files = list(self.base_dir.glob('*.md'))
        print(f"\n找到 {len(md_files)} 個 Markdown 檔案")

        for i, file_path in enumerate(md_files, 1):
            print(f"處理 Markdown 檔案 ({i}/{len(md_files)}): {file_path.name}")
            article = self.extract_from_markdown(file_path)
            if article:
                self.articles.append(article)

        print(f"\n成功處理 {len(self.articles)} 篇文章")

    def save_structured_data(self, output_file: str = 'structured_data.json'):
        """儲存結構化資料為 JSON"""
        output_path = self.base_dir / output_file

        with open(output_path, 'w', encoding='utf-8') as f:
            json.dump(self.articles, f, ensure_ascii=False, indent=2)

        print(f"\n已儲存結構化資料至: {output_path}")

    def generate_topic_distribution(self, output_file: str = 'topic_distribution.csv'):
        """生成主題分佈統計"""
        output_path = self.base_dir / output_file

        # 統計每個主題的文章數
        topic_counts = defaultdict(int)

        for article in self.articles:
            for topic in article['topics']:
                topic_counts[topic] += 1

        # 寫入 CSV
        with open(output_path, 'w', encoding='utf-8-sig', newline='') as f:
            writer = csv.writer(f)
            writer.writerow(['主題', '文章數量', '佔比 (%)'])

            total = len(self.articles)
            for topic, count in sorted(topic_counts.items(), key=lambda x: x[1], reverse=True):
                percentage = (count / total * 100) if total > 0 else 0
                writer.writerow([topic, count, f"{percentage:.1f}"])

        print(f"已儲存主題分佈至: {output_path}")

    def generate_timeline(self, output_file: str = 'timeline.csv'):
        """生成時間序列統計"""
        output_path = self.base_dir / output_file

        # 按月份統計
        monthly_counts = defaultdict(int)

        for article in self.articles:
            date_str = article['date']
            try:
                # 提取年月
                year_month = date_str[:7]  # YYYY-MM
                monthly_counts[year_month] += 1
            except:
                continue

        # 寫入 CSV
        with open(output_path, 'w', encoding='utf-8-sig', newline='') as f:
            writer = csv.writer(f)
            writer.writerow(['年月', '文章數量'])

            for year_month in sorted(monthly_counts.keys()):
                count = monthly_counts[year_month]
                writer.writerow([year_month, count])

        print(f"已儲存時間序列至: {output_path}")

    def print_summary(self):
        """印出統計摘要"""
        print("\n" + "="*50)
        print("處理摘要")
        print("="*50)

        print(f"\n總文章數: {len(self.articles)}")

        # 來源類型統計
        source_counts = defaultdict(int)
        for article in self.articles:
            source_counts[article['source_type']] += 1

        print("\n來源類型分佈:")
        for source_type, count in sorted(source_counts.items(), key=lambda x: x[1], reverse=True):
            print(f"  {source_type}: {count} 篇")

        # 主題統計
        topic_counts = defaultdict(int)
        for article in self.articles:
            for topic in article['topics']:
                topic_counts[topic] += 1

        print("\n主題分佈 (Top 5):")
        for topic, count in sorted(topic_counts.items(), key=lambda x: x[1], reverse=True)[:5]:
            print(f"  {topic}: {count} 篇")

        print("\n" + "="*50)


def main():
    """主程式"""
    # 設定基礎目錄（當前目錄）
    base_dir = os.path.dirname(os.path.abspath(__file__))

    # 建立處理器
    processor = ArticleProcessor(base_dir)

    # 處理所有檔案
    processor.process_all_files()

    # 儲存結果
    processor.save_structured_data()
    processor.generate_topic_distribution()
    processor.generate_timeline()

    # 印出摘要
    processor.print_summary()

    print("\n所有處理完成！")


if __name__ == '__main__':
    main()
