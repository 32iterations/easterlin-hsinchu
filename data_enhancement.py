#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
竹科家庭数据增强脚本 - 完整版
实施6阶段数据清理与增强
"""
import json
import re
from collections import Counter, defaultdict
from datetime import datetime
from typing import List, Dict, Set, Tuple


class DataEnhancer:
    """数据增强处理器"""

    # 政策关键词映射
    POLICY_KEYWORDS = {
        '长照2.0': ['长照', '日照中心', '失智', '长照服务', '照护', 'ABC长照', '社区照顾'],
        '托育补助': ['托育', '公共托婴中心', '托育费用', '育儿津贴', '托婴', '保母'],
        '财划法': ['财划法', '统筹分配', '预算', '214亿', '293亿', '负债'],
        '社福中心': ['社会福利', '福利馆', '社福中心', '一区一中心', '赤土崎'],
        '竹科效应': ['竹科', '人口成长', '高薪', '生育潮', '科学园区', '工程师'],
        '一学区一日照': ['日照', '学区', 'ABC长照', '社区照顾', '失智据点']
    }

    # 地点实体关键词
    LOCATION_ENTITIES = [
        '东区', '北区', '香山区', '竹科', '科学园区', '园区', '新竹科学园区',
        '竹北', '竹东', '头份', '桃园', '八德', '青埔', '台北',
        '巨城', '关东市场', '护城河', '清华大学', '交通大学', '清大', '交大',
        '东科路', '光复路', '金桥', '赤土崎', '新竹市'
    ]

    # 机构实体关键词
    ORGANIZATION_ENTITIES = [
        '台积电', '联发科', '联电', '友达', '华硕', '和硕', '广达',
        '新竹市政府', '社会处', '卫生局', '长期照顾管理中心', '长照管理中心',
        '竹科实中', '清华附小', '华德福', '实验小学',
        '老五老基金会', '伊甸基金会', '公共托婴中心', '托育资源中心',
        '日照中心', '失智据点'
    ]

    # 人物角色关键词
    PERSON_ROLE_ENTITIES = [
        '竹科妈妈', '工程师', 'RD', '研发工程师', '产线人员',
        '双薪家庭', '单亲', '隔代教养', '全职妈妈', '全职爸爸',
        '新生儿', '幼儿', '学龄儿童', '青少年', '长辈', '失智长者',
        '北漂', '台北人', '竹科人', '高学历'
    ]

    # 痛点分类关键词
    PAIN_POINT_CATEGORIES = {
        '时间类': ['通勤', '接送', '等待', '时间', '晚', '早', '赶', '忙', '来不及', '塞车'],
        '金钱类': ['托育费用', '房价', '房贷', '租金', '车', '补习费', '学费', '贵', '钱', '开销'],
        '心理类': ['焦虑', '压力', '孤立', '排挤', '竞争', '紧张', '忧郁', '崩溃', '慢性处方笺'],
        '关系类': ['吵架', '冲突', '疏离', '陌生', '失和', '离婚', '夫妻'],
        '健康类': ['慢性病', '睡眠', '健检', '红字', '心理健康', '诊所', '溺毙', '安全'],
        '资源类': ['托育不足', '排队', '分散', '远', '不便', '缺乏', '没有']
    }

    def __init__(self, input_file='structured_data.json'):
        self.input_file = input_file
        self.data = []
        self.assessment_report = []

    def load_data(self):
        """载入数据"""
        with open(self.input_file, 'r', encoding='utf-8') as f:
            self.data = json.load(f)
        self.log(f"载入 {len(self.data)} 篇文章")

    def log(self, message):
        """记录日志"""
        self.assessment_report.append(message)

    # ===== 阶段一：基础清理 =====

    def remove_duplicates(self):
        """去重 - 基于标题相似度"""
        self.log("\n【阶段一：基础清理】")
        self.log("1. 去重处理...")

        seen_titles = {}
        unique_data = []

        for article in self.data:
            title = article['title']
            # 标准化标题（去除空格、标点）
            normalized_title = re.sub(r'[\s\.\-_\|｜]', '', title)

            # 检查是否已存在相似标题
            is_duplicate = False
            for seen_title in seen_titles:
                if self._similarity(normalized_title, seen_title) > 0.85:
                    is_duplicate = True
                    self.log(f"  重复: {title}")
                    break

            if not is_duplicate:
                seen_titles[normalized_title] = title
                unique_data.append(article)

        removed_count = len(self.data) - len(unique_data)
        self.data = unique_data
        self.log(f"  移除 {removed_count} 篇重复文章，保留 {len(self.data)} 篇")

    def _similarity(self, s1: str, s2: str) -> float:
        """简单的字符串相似度计算"""
        if not s1 or not s2:
            return 0.0

        # 使用集合交集计算相似度
        set1 = set(s1)
        set2 = set(s2)
        intersection = len(set1 & set2)
        union = len(set1 | set2)

        return intersection / union if union > 0 else 0.0

    def remove_noise(self):
        """去噪 - 移除广告、导航等无关内容"""
        self.log("\n2. 去噪处理...")

        noise_patterns = [
            r'订阅.*VIP',
            r'加入.*LINE',
            r'更多.*请.*',
            r'相关报导',
            r'广告',
            r'Cookie',
            r'隐私权',
            r'服务条款',
            r'Facebook',
            r'Instagram',
            r'按赞',
            r'分享',
            r'留言',
            r'回覆'
        ]

        for article in self.data:
            content = article['content']

            # 移除噪音模式
            for pattern in noise_patterns:
                content = re.sub(pattern + r'[^\n]*', '', content)

            # 移除多余空行
            content = re.sub(r'\n\s*\n', '\n\n', content)

            article['content'] = content.strip()

        self.log(f"  完成内容去噪处理")

    def normalize_text(self):
        """文本标准化"""
        self.log("\n3. 文本标准化...")

        normalized_count = 0

        for article in self.data:
            # 统一日期格式
            date = article['date']
            normalized_date = self._normalize_date(date)
            if normalized_date != date:
                article['date'] = normalized_date
                normalized_count += 1

            # 移除HTML残留
            article['content'] = self._remove_html_tags(article['content'])
            article['title'] = self._remove_html_tags(article['title'])

        self.log(f"  标准化 {normalized_count} 个日期")

    def _normalize_date(self, date_str: str) -> str:
        """标准化日期格式为 YYYY-MM-DD"""
        # 已经是正确格式
        if re.match(r'\d{4}-\d{2}-\d{2}', date_str):
            return date_str

        # 尝试其他格式
        patterns = [
            (r'(\d{4})/(\d{1,2})/(\d{1,2})', r'\1-\2-\3'),
            (r'(\d{4})年(\d{1,2})月(\d{1,2})日', r'\1-\2-\3'),
        ]

        for pattern, replacement in patterns:
            match = re.search(pattern, date_str)
            if match:
                return re.sub(pattern, replacement, date_str)

        return date_str

    def _remove_html_tags(self, text: str) -> str:
        """移除HTML标签残留"""
        text = re.sub(r'<[^>]+>', '', text)
        text = re.sub(r'&nbsp;', ' ', text)
        text = re.sub(r'&lt;', '<', text)
        text = re.sub(r'&gt;', '>', text)
        text = re.sub(r'&amp;', '&', text)
        return text

    # ===== 阶段二：情绪与强度标注 =====

    def annotate_emotion_and_intensity(self):
        """情绪分析与痛点强度标注"""
        self.log("\n【阶段二：情绪与强度标注】")

        for article in self.data:
            text = article['title'] + ' ' + article['content']

            # 情绪分析
            article['emotion_score'] = self._analyze_emotion(text)

            # 痛点强度
            article['pain_point_intensity'] = self._analyze_pain_intensity(text)

        self.log(f"  完成 {len(self.data)} 篇文章的情绪与强度标注")

    def _analyze_emotion(self, text: str) -> float:
        """简单的情绪分析"""
        negative_words = [
            '压力', '焦虑', '崩溃', '痛苦', '困难', '失望', '绝望', '愤怒',
            '哭', '累', '忙', '贫穷', '贫戶', '抱怨', '讨厌', '无法', '失败'
        ]
        positive_words = [
            '希望', '满意', '开心', '幸福', '成功', '感谢', '欣慰', '改善',
            '支持', '帮助', '解决', '便利', '美好'
        ]

        neg_count = sum(1 for word in negative_words if word in text)
        pos_count = sum(1 for word in positive_words if word in text)

        total = neg_count + pos_count
        if total == 0:
            return 0.0

        # 归一化到 -1.0 到 1.0
        score = (pos_count - neg_count) / (total * 2)
        return max(-1.0, min(1.0, score))

    def _analyze_pain_intensity(self, text: str) -> str:
        """痛点强度分析"""
        high_intensity_keywords = [
            '溺毙', '死亡', '安全', '危险', '离婚', '崩溃', '忧郁',
            '慢性处方笺', '心理疾病', '排挤', '霸凌', '诊所'
        ]
        medium_intensity_keywords = [
            '通勤', '接送', '加班', '压力', '费用', '房贷', '焦虑', '吵架'
        ]

        high_count = sum(1 for word in high_intensity_keywords if word in text)
        medium_count = sum(1 for word in medium_intensity_keywords if word in text)

        if high_count >= 1:
            return '高'
        elif medium_count >= 2:
            return '中'
        else:
            return '低'

    # ===== 阶段三：实体识别 =====

    def extract_entities(self):
        """提取地点、机构、人物角色实体"""
        self.log("\n【阶段三：实体识别】")

        for article in self.data:
            text = article['title'] + ' ' + article['content']

            article['entities'] = {
                'locations': self._extract_location_entities(text),
                'organizations': self._extract_organization_entities(text),
                'person_roles': self._extract_person_role_entities(text)
            }

        self.log(f"  完成 {len(self.data)} 篇文章的实体识别")

    def _extract_location_entities(self, text: str) -> List[str]:
        """提取地点实体"""
        found = set()
        for location in self.LOCATION_ENTITIES:
            if location in text:
                found.add(location)
        return sorted(list(found))

    def _extract_organization_entities(self, text: str) -> List[str]:
        """提取机构实体"""
        found = set()
        for org in self.ORGANIZATION_ENTITIES:
            if org in text:
                found.add(org)
        return sorted(list(found))

    def _extract_person_role_entities(self, text: str) -> List[str]:
        """提取人物角色实体"""
        found = set()
        for role in self.PERSON_ROLE_ENTITIES:
            if role in text:
                found.add(role)
        return sorted(list(found))

    # ===== 阶段五：政策对接与主题增强 =====

    def annotate_policy_mapping(self):
        """政策对接标注"""
        self.log("\n【阶段五：政策对接与主题增强】")

        for article in self.data:
            text = article['title'] + ' ' + article['content']

            # 政策对接
            article['related_policy'] = self._map_to_policies(text)

            # 主题增强
            article['topics'] = self._enhance_topics(text, article['topics'])

        self.log(f"  完成 {len(self.data)} 篇文章的政策对接标注")

    def _map_to_policies(self, text: str) -> List[str]:
        """映射到相关政策"""
        policies = []
        for policy, keywords in self.POLICY_KEYWORDS.items():
            if any(keyword in text for keyword in keywords):
                policies.append(policy)
        return policies

    def _enhance_topics(self, text: str, existing_topics: List[str]) -> List[str]:
        """增强主题分类"""
        new_topics = set(existing_topics)

        # 添加新主题
        if any(kw in text for kw in ['通勤', '距离', '接送', '塞车', '远']):
            new_topics.add('时间贫穷')

        if any(kw in text for kw in ['竹北', '头份', '桃园', '台北', '北漂']):
            new_topics.add('跨县市通勤')

        if any(kw in text for kw in ['分散', '远', '不便', '东区', '北区', '香山']):
            new_topics.add('社福资源分散')

        if any(kw in text for kw in ['忧郁', '焦虑', '慢性', '诊所', '心理']):
            new_topics.add('心理健康')

        if any(kw in text for kw in ['排挤', '群组', '竞争', '门槛', '焦虑']):
            new_topics.add('社群排挤')

        if any(kw in text for kw in ['溺毙', '安全', '监管', '师生比']):
            new_topics.add('托育安全')

        return sorted(list(new_topics))

    # ===== 阶段六：关键引文与痛点分类 =====

    def extract_key_quotes_and_categorize(self):
        """提取关键引文并分类痛点"""
        self.log("\n【阶段六：关键引文提取与痛点分类】")

        for article in self.data:
            text = article['content']

            # 提取关键引文
            article['key_quotes'] = self._extract_key_quotes(text)

            # 痛点分类
            article['pain_point_categories'] = self._categorize_pain_points(text)

        self.log(f"  完成 {len(self.data)} 篇文章的引文提取与痛点分类")

    def _extract_key_quotes(self, text: str) -> List[str]:
        """提取关键引文"""
        quotes = []

        # 寻找引号内的内容
        quote_patterns = [
            r'「([^」]{10,100})」',
            r'"([^"]{10,100})"',
        ]

        for pattern in quote_patterns:
            matches = re.findall(pattern, text)
            quotes.extend(matches)

        # 寻找有感染力的句子（包含第一人称或情绪词）
        sentences = re.split(r'[。！？]', text)
        for sentence in sentences:
            if len(sentence) > 20 and len(sentence) < 150:
                if any(word in sentence for word in ['我', '我的', '为什么', '怎么', '难道']):
                    if any(word in sentence for word in ['压力', '焦虑', '崩溃', '困难', '无法']):
                        quotes.append(sentence.strip())

        # 去重并限制数量
        quotes = list(set(quotes))[:5]
        return quotes

    def _categorize_pain_points(self, text: str) -> List[str]:
        """分类痛点类型"""
        categories = []

        for category, keywords in self.PAIN_POINT_CATEGORIES.items():
            if any(keyword in text for keyword in keywords):
                categories.append(category)

        return categories

    # ===== 数据输出 =====

    def save_enhanced_data(self, output_file='cleaned_data_enhanced.json'):
        """保存增强后的数据"""
        with open(output_file, 'w', encoding='utf-8') as f:
            json.dump(self.data, f, ensure_ascii=False, indent=2)

        self.log(f"\n保存增强数据至: {output_file}")

    def generate_reports(self):
        """生成分析报告"""
        self.log("\n【生成分析报告】")

        # 1. 情绪分析报告
        self._generate_emotion_report()

        # 2. 实体统计报告
        self._generate_entity_report()

        # 3. 政策对接报告
        self._generate_policy_report()

        # 4. 痛点矩阵
        self._generate_pain_matrix()

        # 5. 关键引文集合
        self._generate_quotes_collection()

    def _generate_emotion_report(self):
        """生成情绪分析报告"""
        with open('emotion_analysis_enhanced.csv', 'w', encoding='utf-8-sig', newline='') as f:
            import csv
            writer = csv.writer(f)
            writer.writerow(['文章ID', '标题', '日期', '情绪分数', '痛点强度', '可信度', '更新日期'])

            for i, article in enumerate(self.data):
                writer.writerow([
                    f"article_{i+1:03d}",
                    article['title'][:50],
                    article['date'],
                    f"{article.get('emotion_score', 0):.2f}",
                    article.get('pain_point_intensity', '低'),
                    article.get('source_type', '其他'),
                    datetime.now().strftime('%Y-%m-%d')
                ])

        self.log("  生成: emotion_analysis_enhanced.csv")

    def _generate_entity_report(self):
        """生成实体统计报告"""
        with open('entity_extraction_enhanced.csv', 'w', encoding='utf-8-sig', newline='') as f:
            import csv
            writer = csv.writer(f)
            writer.writerow(['文章ID', '地点', '机构', '人物角色', '相关政策'])

            for i, article in enumerate(self.data):
                entities = article.get('entities', {})
                writer.writerow([
                    f"article_{i+1:03d}",
                    '; '.join(entities.get('locations', [])),
                    '; '.join(entities.get('organizations', [])),
                    '; '.join(entities.get('person_roles', [])),
                    '; '.join(article.get('related_policy', []))
                ])

        self.log("  生成: entity_extraction_enhanced.csv")

    def _generate_policy_report(self):
        """生成政策对接报告"""
        policy_stats = defaultdict(lambda: {'count': 0, 'emotions': [], 'intensities': []})

        for article in self.data:
            for policy in article.get('related_policy', []):
                policy_stats[policy]['count'] += 1
                policy_stats[policy]['emotions'].append(article.get('emotion_score', 0))
                intensity = article.get('pain_point_intensity', '低')
                policy_stats[policy]['intensities'].append(intensity)

        with open('policy_mapping_report.csv', 'w', encoding='utf-8-sig', newline='') as f:
            import csv
            writer = csv.writer(f)
            writer.writerow(['政策名称', '相关文章数', '平均情绪分数', '高强度痛点占比'])

            for policy, stats in sorted(policy_stats.items(), key=lambda x: x[1]['count'], reverse=True):
                avg_emotion = sum(stats['emotions']) / len(stats['emotions']) if stats['emotions'] else 0
                high_intensity_ratio = stats['intensities'].count('高') / len(stats['intensities']) * 100 if stats['intensities'] else 0

                writer.writerow([
                    policy,
                    stats['count'],
                    f"{avg_emotion:.2f}",
                    f"{high_intensity_ratio:.1f}%"
                ])

        self.log("  生成: policy_mapping_report.csv")

    def _generate_pain_matrix(self):
        """生成痛点矩阵"""
        with open('pain_point_matrix.csv', 'w', encoding='utf-8-sig', newline='') as f:
            import csv
            writer = csv.writer(f)
            writer.writerow(['文章ID', '标题', '时间类', '金钱类', '心理类', '关系类', '健康类', '资源类'])

            for i, article in enumerate(self.data):
                categories = article.get('pain_point_categories', [])
                writer.writerow([
                    f"article_{i+1:03d}",
                    article['title'][:40],
                    1 if '时间类' in categories else 0,
                    1 if '金钱类' in categories else 0,
                    1 if '心理类' in categories else 0,
                    1 if '关系类' in categories else 0,
                    1 if '健康类' in categories else 0,
                    1 if '资源类' in categories else 0
                ])

        self.log("  生成: pain_point_matrix.csv")

    def _generate_quotes_collection(self):
        """生成关键引文集合"""
        quotes_by_topic = defaultdict(list)

        for article in self.data:
            for topic in article.get('topics', []):
                for quote in article.get('key_quotes', []):
                    quotes_by_topic[topic].append({
                        'quote': quote,
                        'article': article['title'],
                        'date': article['date']
                    })

        with open('key_quotes_collection.json', 'w', encoding='utf-8') as f:
            json.dump(dict(quotes_by_topic), f, ensure_ascii=False, indent=2)

        self.log("  生成: key_quotes_collection.json")

    def save_assessment_report(self):
        """保存评估报告"""
        with open('data_enhancement_report.txt', 'w', encoding='utf-8') as f:
            f.write('\n'.join(self.assessment_report))
            f.write('\n\n=== Report saved successfully ===\n')

    def run_full_pipeline(self):
        """运行完整处理管道"""
        self.log("=== Starting Data Enhancement Pipeline ===")

        # 加载数据
        self.load_data()

        # 阶段一：基础清理
        self.remove_duplicates()
        self.remove_noise()
        self.normalize_text()

        # 阶段二：情绪与强度
        self.annotate_emotion_and_intensity()

        # 阶段三：实体识别
        self.extract_entities()

        # 阶段五：政策对接
        self.annotate_policy_mapping()

        # 阶段六：关键引文
        self.extract_key_quotes_and_categorize()

        # 保存数据
        self.save_enhanced_data()

        # 生成报告
        self.generate_reports()

        self.log("\n=== Pipeline Complete ===")
        self.log(f"Processed {len(self.data)} articles")
        self.log("\nGenerated files:")
        self.log("  - cleaned_data_enhanced.json")
        self.log("  - emotion_analysis_enhanced.csv")
        self.log("  - entity_extraction_enhanced.csv")
        self.log("  - policy_mapping_report.csv")
        self.log("  - pain_point_matrix.csv")
        self.log("  - key_quotes_collection.json")
        self.log("  - data_enhancement_report.txt")

        # 保存评估报告
        self.save_assessment_report()


if __name__ == '__main__':
    enhancer = DataEnhancer()
    enhancer.run_full_pipeline()
