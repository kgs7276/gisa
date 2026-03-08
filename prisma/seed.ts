import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

const questions = [
  // ──────────────────────────────────────────────
  // 소프트웨어 설계 (20문제)
  // ──────────────────────────────────────────────
  {
    year: 2023, round: 1, subject: '소프트웨어 설계', questionNo: 1,
    content: '다음 중 UML의 구조(Structure) 다이어그램이 아닌 것은?',
    optionA: '클래스 다이어그램', optionB: '시퀀스 다이어그램',
    optionC: '객체 다이어그램', optionD: '컴포넌트 다이어그램',
    answer: 2, difficulty: 'EASY', topic: 'UML 다이어그램',
    explanation: '시퀀스 다이어그램은 UML의 행위(Behavioral) 다이어그램입니다. 구조 다이어그램에는 클래스, 객체, 컴포넌트, 배치, 패키지, 복합 구조 다이어그램이 있습니다.',
    tags: JSON.stringify(['UML', '다이어그램']), sourceNote: '2023년 1회',
  },
  {
    year: 2023, round: 1, subject: '소프트웨어 설계', questionNo: 2,
    content: '객체지향에서 상위 클래스 메서드를 하위 클래스에서 재정의하는 것은?',
    optionA: '캡슐화', optionB: '상속', optionC: '오버라이딩', optionD: '추상화',
    answer: 3, difficulty: 'EASY', topic: '객체지향 설계',
    explanation: '오버라이딩(Overriding)은 상위 클래스 메서드를 하위 클래스에서 재정의하는 것으로, 메서드 이름·매개변수·반환타입이 동일해야 합니다.',
    tags: JSON.stringify(['객체지향', '오버라이딩']), sourceNote: '2023년 1회',
  },
  {
    year: 2023, round: 1, subject: '소프트웨어 설계', questionNo: 3,
    content: '소프트웨어 아키텍처에서 파이프-필터(Pipe-Filter) 패턴에 대한 설명으로 옳은 것은?',
    optionA: '데이터 흐름이 필터를 통해 순차적으로 처리된다',
    optionB: '이벤트 발생 시 등록된 구독자에게 알림을 보낸다',
    optionC: '클라이언트-서버 구조로 서비스를 분리한다',
    optionD: '계층 간 요청-응답 방식으로 동작한다',
    answer: 1, difficulty: 'MEDIUM', topic: '아키텍처 설계',
    explanation: '파이프-필터 패턴은 데이터 스트림이 필터(처리 컴포넌트)를 순차적으로 통과하며 변환되는 구조입니다. 유닉스 쉘의 파이프(|)가 대표적입니다.',
    tags: JSON.stringify(['아키텍처', '파이프필터']), sourceNote: '2023년 1회',
  },
  {
    year: 2023, round: 2, subject: '소프트웨어 설계', questionNo: 1,
    content: '디자인 패턴 중 생성(Creational) 패턴에 해당하지 않는 것은?',
    optionA: '싱글톤(Singleton)', optionB: '팩토리 메서드(Factory Method)',
    optionC: '옵서버(Observer)', optionD: '추상 팩토리(Abstract Factory)',
    answer: 3, difficulty: 'MEDIUM', topic: '디자인 패턴',
    explanation: '옵서버(Observer)는 행위(Behavioral) 패턴입니다. 생성 패턴에는 싱글톤, 팩토리 메서드, 추상 팩토리, 빌더, 프로토타입이 있습니다.',
    tags: JSON.stringify(['디자인패턴', 'GoF']), sourceNote: '2023년 2회',
  },
  {
    year: 2023, round: 2, subject: '소프트웨어 설계', questionNo: 2,
    content: '요구사항 명세서(SRS)에 포함되어야 할 내용으로 거리가 먼 것은?',
    optionA: '기능 요구사항', optionB: '비기능 요구사항',
    optionC: '소스코드 구현 방법', optionD: '시스템 인터페이스',
    answer: 3, difficulty: 'EASY', topic: '요구사항 분석',
    explanation: 'SRS(Software Requirements Specification)는 무엇을(What) 구현할지를 기술하며, 어떻게(How) 구현할지(소스코드 구현 방법)는 설계 문서에 해당합니다.',
    tags: JSON.stringify(['요구사항', 'SRS']), sourceNote: '2023년 2회',
  },
  {
    year: 2022, round: 1, subject: '소프트웨어 설계', questionNo: 1,
    content: 'SOLID 원칙 중 "소프트웨어 개체는 확장에는 열려 있어야 하고, 수정에는 닫혀 있어야 한다"는 원칙은?',
    optionA: '단일 책임 원칙(SRP)', optionB: '개방-폐쇄 원칙(OCP)',
    optionC: '리스코프 치환 원칙(LSP)', optionD: '의존 역전 원칙(DIP)',
    answer: 2, difficulty: 'MEDIUM', topic: '객체지향 설계',
    explanation: '개방-폐쇄 원칙(Open-Closed Principle)은 기능 확장은 가능하되 기존 코드 수정 없이 이루어져야 한다는 원칙으로, 추상화와 다형성으로 구현합니다.',
    tags: JSON.stringify(['SOLID', 'OCP', '객체지향']), sourceNote: '2022년 1회',
  },
  {
    year: 2022, round: 2, subject: '소프트웨어 설계', questionNo: 1,
    content: '유스케이스 다이어그램의 관계 중 기본 유스케이스 수행 시 특정 조건에서 선택적으로 포함되는 관계는?',
    optionA: '연관(Association)', optionB: '포함(Include)',
    optionC: '확장(Extend)', optionD: '일반화(Generalization)',
    answer: 3, difficulty: 'MEDIUM', topic: 'UML 다이어그램',
    explanation: '확장(Extend) 관계는 기본 유스케이스에서 특정 조건이 만족될 때 선택적으로 실행됩니다. 포함(Include)은 항상 포함되는 관계입니다.',
    tags: JSON.stringify(['UML', '유스케이스', 'Extend']), sourceNote: '2022년 2회',
  },
  {
    year: 2022, round: 3, subject: '소프트웨어 설계', questionNo: 1,
    content: '소프트웨어 모듈의 결합도(Coupling)가 가장 낮은(좋은) 유형은?',
    optionA: '내용 결합도', optionB: '공통 결합도', optionC: '자료 결합도', optionD: '제어 결합도',
    answer: 3, difficulty: 'MEDIUM', topic: '모듈 설계',
    explanation: '결합도는 낮을수록 좋으며, 낮은 순서는 자료 < 스탬프 < 제어 < 외부 < 공통 < 내용 결합도입니다. 자료 결합도가 가장 이상적입니다.',
    tags: JSON.stringify(['결합도', '모듈', '설계']), sourceNote: '2022년 3회',
  },
  {
    year: 2021, round: 1, subject: '소프트웨어 설계', questionNo: 1,
    content: '소프트웨어 개발 방법론 중 애자일(Agile) 방법론의 특징으로 옳지 않은 것은?',
    optionA: '반복적이고 점진적인 개발', optionB: '고객과의 지속적인 협업',
    optionC: '계획과 문서화를 최우선으로 함', optionD: '변화에 유연하게 대응',
    answer: 3, difficulty: 'EASY', topic: '소프트웨어 공학',
    explanation: '애자일은 문서보다 동작하는 소프트웨어를, 계획 준수보다 변화 대응을 우선시합니다. 계획과 문서화를 최우선으로 하는 것은 전통적 폭포수 모델의 특징입니다.',
    tags: JSON.stringify(['애자일', '개발방법론']), sourceNote: '2021년 1회',
  },
  {
    year: 2021, round: 2, subject: '소프트웨어 설계', questionNo: 1,
    content: '응집도(Cohesion)의 종류 중 가장 강한(좋은) 응집도는?',
    optionA: '논리적 응집도', optionB: '기능적 응집도', optionC: '우연적 응집도', optionD: '시간적 응집도',
    answer: 2, difficulty: 'MEDIUM', topic: '모듈 설계',
    explanation: '응집도는 높을수록 좋으며, 높은 순서는 기능적 > 순차적 > 교환적 > 절차적 > 시간적 > 논리적 > 우연적 응집도입니다.',
    tags: JSON.stringify(['응집도', '모듈']), sourceNote: '2021년 2회',
  },

  // ──────────────────────────────────────────────
  // 소프트웨어 개발 (20문제)
  // ──────────────────────────────────────────────
  {
    year: 2023, round: 1, subject: '소프트웨어 개발', questionNo: 1,
    content: '스택(Stack)에 대한 설명으로 옳은 것은?',
    optionA: 'FIFO(First In First Out) 방식으로 동작한다',
    optionB: 'LIFO(Last In First Out) 방식으로 동작한다',
    optionC: '삽입은 rear에서, 삭제는 front에서 이루어진다',
    optionD: '양쪽 끝에서 삽입과 삭제가 가능하다',
    answer: 2, difficulty: 'EASY', topic: '자료구조',
    explanation: '스택은 LIFO(후입선출) 구조로 가장 나중에 삽입된 데이터가 먼저 삭제됩니다. FIFO는 큐(Queue)의 특성입니다.',
    tags: JSON.stringify(['스택', '자료구조', 'LIFO']), sourceNote: '2023년 1회',
  },
  {
    year: 2023, round: 1, subject: '소프트웨어 개발', questionNo: 2,
    content: '소프트웨어 테스트 기법 중 블랙박스 테스트(Black-box Test)에 해당하는 것은?',
    optionA: '구문 커버리지', optionB: '경계값 분석', optionC: '조건 커버리지', optionD: '분기 커버리지',
    answer: 2, difficulty: 'MEDIUM', topic: '테스트',
    explanation: '경계값 분석(Boundary Value Analysis)은 입력값의 경계 부분을 테스트하는 블랙박스 기법입니다. 구문/조건/분기 커버리지는 화이트박스 테스트 기법입니다.',
    tags: JSON.stringify(['테스트', '블랙박스', '경계값분석']), sourceNote: '2023년 1회',
  },
  {
    year: 2023, round: 2, subject: '소프트웨어 개발', questionNo: 1,
    content: '정렬 알고리즘 중 최선·평균·최악 모두 O(n log n)의 시간복잡도를 보장하는 것은?',
    optionA: '버블 정렬', optionB: '삽입 정렬', optionC: '퀵 정렬', optionD: '합병 정렬',
    answer: 4, difficulty: 'MEDIUM', topic: '알고리즘',
    explanation: '합병 정렬(Merge Sort)은 분할 정복 방식으로 최선·평균·최악 모두 O(n log n)을 보장합니다. 퀵 정렬은 최악의 경우 O(n²)이 될 수 있습니다.',
    tags: JSON.stringify(['정렬', '시간복잡도', '합병정렬']), sourceNote: '2023년 2회',
  },
  {
    year: 2022, round: 1, subject: '소프트웨어 개발', questionNo: 1,
    content: '형상 관리(Configuration Management) 도구가 아닌 것은?',
    optionA: 'Git', optionB: 'SVN', optionC: 'Jenkins', optionD: 'CVS',
    answer: 3, difficulty: 'EASY', topic: '빌드 및 배포',
    explanation: 'Jenkins는 CI/CD(지속적 통합/배포) 도구입니다. Git, SVN, CVS는 소스코드 버전 관리(형상 관리) 도구입니다.',
    tags: JSON.stringify(['형상관리', 'Git', 'CI/CD']), sourceNote: '2022년 1회',
  },
  {
    year: 2022, round: 2, subject: '소프트웨어 개발', questionNo: 1,
    content: '다음 중 트리(Tree)의 특성으로 옳지 않은 것은?',
    optionA: '사이클이 존재하지 않는다',
    optionB: 'n개의 노드를 가진 트리는 n-1개의 간선을 가진다',
    optionC: '임의의 두 노드 사이에 경로가 반드시 2개 이상 존재한다',
    optionD: '루트 노드는 하나만 존재한다',
    answer: 3, difficulty: 'MEDIUM', topic: '자료구조',
    explanation: '트리는 비선형 계층 구조로, 임의의 두 노드 사이에 경로가 유일하게 하나만 존재합니다. 사이클이 없고, 루트가 하나이며, n개 노드에 n-1개 간선이 있습니다.',
    tags: JSON.stringify(['트리', '자료구조', '그래프']), sourceNote: '2022년 2회',
  },
  {
    year: 2022, round: 3, subject: '소프트웨어 개발', questionNo: 1,
    content: 'McCabe의 순환 복잡도(Cyclomatic Complexity)를 구하는 공식으로 옳은 것은? (E: 간선 수, N: 노드 수)',
    optionA: 'E - N + 1', optionB: 'E - N + 2', optionC: 'E + N - 1', optionD: 'E + N + 2',
    answer: 2, difficulty: 'HARD', topic: '테스트',
    explanation: 'McCabe의 순환 복잡도 공식은 V(G) = E - N + 2입니다. 이 값이 클수록 코드가 복잡하며 테스트가 어렵습니다.',
    tags: JSON.stringify(['순환복잡도', 'McCabe', '테스트']), sourceNote: '2022년 3회',
  },
  {
    year: 2021, round: 1, subject: '소프트웨어 개발', questionNo: 1,
    content: '소프트웨어 품질 속성 중 주어진 조건에서 특정 기능을 수행할 때 적절한 성능을 제공하는 능력은?',
    optionA: '신뢰성(Reliability)', optionB: '효율성(Efficiency)',
    optionC: '유지보수성(Maintainability)', optionD: '이식성(Portability)',
    answer: 2, difficulty: 'MEDIUM', topic: '소스코드 품질',
    explanation: '효율성(Efficiency)은 명시된 조건에서 적절한 성능과 자원 사용량을 제공하는 능력입니다. 신뢰성은 정확하고 일관된 결과를 제공하는 능력입니다.',
    tags: JSON.stringify(['품질', 'ISO', '효율성']), sourceNote: '2021년 1회',
  },
  {
    year: 2021, round: 2, subject: '소프트웨어 개발', questionNo: 1,
    content: '이진 탐색(Binary Search)의 전제 조건으로 옳은 것은?',
    optionA: '데이터가 정렬되어 있어야 한다',
    optionB: '데이터가 연결 리스트로 저장되어 있어야 한다',
    optionC: '데이터의 크기가 2의 거듭제곱이어야 한다',
    optionD: '데이터에 중복이 없어야 한다',
    answer: 1, difficulty: 'EASY', topic: '알고리즘',
    explanation: '이진 탐색은 정렬된 배열에서 중간값과 비교하며 탐색 범위를 절반씩 줄이는 방식으로, 반드시 데이터가 정렬된 상태여야 합니다. 시간복잡도는 O(log n)입니다.',
    tags: JSON.stringify(['이진탐색', '탐색', '알고리즘']), sourceNote: '2021년 2회',
  },
  {
    year: 2020, round: 1, subject: '소프트웨어 개발', questionNo: 1,
    content: '클린코드(Clean Code)의 작성 원칙으로 거리가 먼 것은?',
    optionA: '의미 있는 이름 사용', optionB: '함수는 하나의 일만 수행',
    optionC: '성능을 위해 중복 코드를 허용', optionD: '주석보다 코드 자체로 의미 전달',
    answer: 3, difficulty: 'EASY', topic: '소스코드 품질',
    explanation: '클린코드는 중복 제거(DRY 원칙)를 핵심 원칙으로 합니다. 성능을 위해 중복을 허용하는 것은 클린코드 원칙에 위배됩니다.',
    tags: JSON.stringify(['클린코드', '리팩토링']), sourceNote: '2020년 1회',
  },
  {
    year: 2020, round: 2, subject: '소프트웨어 개발', questionNo: 1,
    content: '다음 중 화이트박스 테스트 커버리지 기준 중 가장 강력한 것은?',
    optionA: '구문(Statement) 커버리지', optionB: '결정(Decision) 커버리지',
    optionC: '조건(Condition) 커버리지', optionD: '조건/결정(MC/DC) 커버리지',
    answer: 4, difficulty: 'HARD', topic: '테스트',
    explanation: 'MC/DC(Modified Condition/Decision Coverage)는 각 조건이 결정 결과에 독립적으로 영향을 미치는 경우를 테스트하는 가장 강력한 커버리지 기준입니다.',
    tags: JSON.stringify(['커버리지', '화이트박스', 'MCDC']), sourceNote: '2020년 2회',
  },

  // ──────────────────────────────────────────────
  // 데이터베이스 구축 (20문제)
  // ──────────────────────────────────────────────
  {
    year: 2023, round: 1, subject: '데이터베이스 구축', questionNo: 1,
    content: '관계형 데이터베이스에서 기본키(Primary Key)의 특성으로 옳지 않은 것은?',
    optionA: 'NULL 값을 가질 수 없다', optionB: '중복값이 없어야 한다',
    optionC: '외래키(Foreign Key)가 될 수 없다', optionD: '테이블당 하나만 정의된다',
    answer: 3, difficulty: 'EASY', topic: '데이터베이스 설계',
    explanation: '기본키는 외래키가 될 수 있습니다. 예를 들어 복합 테이블에서 기본키가 동시에 다른 테이블을 참조하는 외래키 역할을 합니다.',
    tags: JSON.stringify(['기본키', 'PK', '관계형DB']), sourceNote: '2023년 1회',
  },
  {
    year: 2023, round: 2, subject: '데이터베이스 구축', questionNo: 1,
    content: '데이터베이스 정규화에서 제2정규형(2NF)이 되기 위한 조건은?',
    optionA: '1NF를 만족하고 부분 함수 종속을 제거',
    optionB: '1NF를 만족하고 이행 함수 종속을 제거',
    optionC: '2NF를 만족하고 이행 함수 종속을 제거',
    optionD: '모든 속성이 원자값을 가져야 함',
    answer: 1, difficulty: 'MEDIUM', topic: '정규화',
    explanation: '2NF는 1NF를 만족하면서 완전 함수 종속(부분 함수 종속 제거)을 만족해야 합니다. 이행 함수 종속 제거는 3NF의 조건입니다.',
    tags: JSON.stringify(['정규화', '2NF']), sourceNote: '2023년 2회',
  },
  {
    year: 2023, round: 2, subject: '데이터베이스 구축', questionNo: 2,
    content: 'SQL에서 그룹 함수와 함께 사용하며 그룹에 대한 조건을 지정하는 절은?',
    optionA: 'WHERE', optionB: 'HAVING', optionC: 'GROUP BY', optionD: 'ORDER BY',
    answer: 2, difficulty: 'EASY', topic: 'SQL',
    explanation: 'HAVING은 GROUP BY로 그룹화된 결과에 조건을 적용합니다. WHERE는 그룹화 전 행에 조건을 적용하며, 집계 함수를 WHERE에서 사용할 수 없습니다.',
    tags: JSON.stringify(['SQL', 'HAVING', 'GROUP BY']), sourceNote: '2023년 2회',
  },
  {
    year: 2022, round: 1, subject: '데이터베이스 구축', questionNo: 1,
    content: '트랜잭션의 ACID 속성 중 트랜잭션이 완료되면 그 결과가 영구적으로 유지되는 속성은?',
    optionA: '원자성(Atomicity)', optionB: '일관성(Consistency)',
    optionC: '고립성(Isolation)', optionD: '지속성(Durability)',
    answer: 4, difficulty: 'EASY', topic: '트랜잭션',
    explanation: '지속성(Durability)은 트랜잭션이 성공적으로 완료(COMMIT)되면 그 결과가 장애가 발생해도 영구적으로 반영됨을 보장합니다.',
    tags: JSON.stringify(['트랜잭션', 'ACID', '지속성']), sourceNote: '2022년 1회',
  },
  {
    year: 2022, round: 2, subject: '데이터베이스 구축', questionNo: 1,
    content: 'SQL의 DDL(Data Definition Language) 명령어가 아닌 것은?',
    optionA: 'CREATE', optionB: 'ALTER', optionC: 'UPDATE', optionD: 'DROP',
    answer: 3, difficulty: 'EASY', topic: 'SQL',
    explanation: 'UPDATE는 데이터 조작어(DML)입니다. DDL에는 CREATE(생성), ALTER(수정), DROP(삭제), TRUNCATE(초기화), RENAME이 있습니다.',
    tags: JSON.stringify(['SQL', 'DDL', 'DML']), sourceNote: '2022년 2회',
  },
  {
    year: 2022, round: 3, subject: '데이터베이스 구축', questionNo: 1,
    content: '데이터베이스 뷰(View)에 대한 설명으로 옳지 않은 것은?',
    optionA: '논리적 독립성을 제공한다',
    optionB: '뷰를 통한 데이터 접근으로 보안을 강화할 수 있다',
    optionC: '인덱스를 직접 생성하여 성능을 향상시킬 수 있다',
    optionD: '복잡한 쿼리를 단순화하여 사용할 수 있다',
    answer: 3, difficulty: 'MEDIUM', topic: '데이터베이스 설계',
    explanation: '뷰(View)는 가상 테이블로, 자체 인덱스를 생성할 수 없습니다. 기본 테이블의 인덱스를 활용합니다.',
    tags: JSON.stringify(['뷰', 'View', 'SQL']), sourceNote: '2022년 3회',
  },
  {
    year: 2021, round: 1, subject: '데이터베이스 구축', questionNo: 1,
    content: 'E-R 다이어그램에서 개체(Entity)와 개체 사이의 관계를 나타내는 기호는?',
    optionA: '사각형', optionB: '타원', optionC: '마름모', optionD: '선',
    answer: 3, difficulty: 'EASY', topic: '데이터 모델링',
    explanation: 'E-R 다이어그램에서 사각형=개체(Entity), 타원=속성(Attribute), 마름모=관계(Relationship), 선=연결을 나타냅니다.',
    tags: JSON.stringify(['ER다이어그램', '데이터모델링']), sourceNote: '2021년 1회',
  },
  {
    year: 2021, round: 2, subject: '데이터베이스 구축', questionNo: 1,
    content: '관계 데이터베이스에서 릴레이션의 튜플(Tuple) 수를 나타내는 용어는?',
    optionA: '차수(Degree)', optionB: '카디널리티(Cardinality)',
    optionC: '도메인(Domain)', optionD: '스키마(Schema)',
    answer: 2, difficulty: 'EASY', topic: '데이터베이스 설계',
    explanation: '카디널리티(Cardinality)는 릴레이션의 행(튜플) 수를 의미합니다. 차수(Degree)는 속성(열)의 수입니다.',
    tags: JSON.stringify(['카디널리티', '릴레이션', '관계DB']), sourceNote: '2021년 2회',
  },
  {
    year: 2020, round: 1, subject: '데이터베이스 구축', questionNo: 1,
    content: 'SELECT 문에서 중복 행을 제거하여 결과를 출력하는 키워드는?',
    optionA: 'UNIQUE', optionB: 'DISTINCT', optionC: 'REMOVE', optionD: 'FILTER',
    answer: 2, difficulty: 'EASY', topic: 'SQL',
    explanation: 'DISTINCT 키워드는 SELECT 결과에서 중복 행을 제거합니다. SELECT DISTINCT 컬럼명 FROM 테이블명 형식으로 사용합니다.',
    tags: JSON.stringify(['SQL', 'DISTINCT', 'SELECT']), sourceNote: '2020년 1회',
  },
  {
    year: 2020, round: 2, subject: '데이터베이스 구축', questionNo: 1,
    content: '데이터베이스의 병행 제어(Concurrency Control)에서 발생할 수 있는 문제가 아닌 것은?',
    optionA: '갱신 분실(Lost Update)', optionB: '모순성(Inconsistency)',
    optionC: '연쇄 복귀(Cascading Rollback)', optionD: '교착 상태(Deadlock)',
    answer: 4, difficulty: 'HARD', topic: '트랜잭션',
    explanation: '교착 상태(Deadlock)는 병행 제어 문제이기도 하지만, 주로 잠금(Lock) 메커니즘에서 발생하는 별도 문제입니다. 갱신 분실, 모순성, 연쇄 복귀가 대표적인 병행 제어 문제입니다.',
    tags: JSON.stringify(['병행제어', '트랜잭션', '교착상태']), sourceNote: '2020년 2회',
  },

  // ──────────────────────────────────────────────
  // 프로그래밍 언어 활용 (20문제)
  // ──────────────────────────────────────────────
  {
    year: 2023, round: 1, subject: '프로그래밍 언어 활용', questionNo: 1,
    content: '다음 C언어 코드의 출력 결과는?\n\nint main() {\n    int a = 5;\n    printf("%d", a++);\n    return 0;\n}',
    optionA: '4', optionB: '5', optionC: '6', optionD: '컴파일 오류',
    answer: 2, difficulty: 'MEDIUM', topic: 'C언어',
    explanation: 'a++는 후위 증가 연산자입니다. printf에서 현재 값(5)을 먼저 출력한 후 a를 6으로 증가시킵니다. 출력 결과는 5입니다.',
    tags: JSON.stringify(['C언어', '연산자']), sourceNote: '2023년 1회',
  },
  {
    year: 2023, round: 2, subject: '프로그래밍 언어 활용', questionNo: 1,
    content: 'OSI 7계층 모델에서 데이터의 암호화와 압축을 담당하는 계층은?',
    optionA: '세션 계층', optionB: '표현 계층', optionC: '응용 계층', optionD: '전송 계층',
    answer: 2, difficulty: 'MEDIUM', topic: '네트워크',
    explanation: '표현 계층(Presentation Layer, 6계층)은 데이터의 형식 변환, 암호화, 복호화, 압축을 담당합니다. 세션 계층은 통신 세션을 관리합니다.',
    tags: JSON.stringify(['OSI7계층', '네트워크', '암호화']), sourceNote: '2023년 2회',
  },
  {
    year: 2022, round: 1, subject: '프로그래밍 언어 활용', questionNo: 1,
    content: '프로세스 스케줄링 알고리즘 중 비선점(Non-preemptive) 방식이 아닌 것은?',
    optionA: 'FCFS(First Come First Served)', optionB: 'SJF(Shortest Job First)',
    optionC: 'Round Robin', optionD: '우선순위 스케줄링(비선점)',
    answer: 3, difficulty: 'MEDIUM', topic: '운영체제',
    explanation: 'Round Robin은 각 프로세스에 동일한 시간 할당량(Time Quantum)을 부여하고, 할당 시간이 끝나면 강제로 CPU를 빼앗는 선점(Preemptive) 방식입니다.',
    tags: JSON.stringify(['스케줄링', '운영체제', 'RoundRobin']), sourceNote: '2022년 1회',
  },
  {
    year: 2022, round: 2, subject: '프로그래밍 언어 활용', questionNo: 1,
    content: 'Python에서 리스트의 마지막 요소를 제거하고 반환하는 메서드는?',
    optionA: 'remove()', optionB: 'delete()', optionC: 'pop()', optionD: 'discard()',
    answer: 3, difficulty: 'EASY', topic: 'Python',
    explanation: 'pop()은 인덱스를 지정하지 않으면 리스트의 마지막 요소를 제거하고 반환합니다. remove()는 값을 지정하여 제거하지만 반환하지 않습니다.',
    tags: JSON.stringify(['Python', '리스트', '메서드']), sourceNote: '2022년 2회',
  },
  {
    year: 2022, round: 3, subject: '프로그래밍 언어 활용', questionNo: 1,
    content: '다음 중 IP 주소 클래스 A에 해당하는 첫 번째 옥텟의 범위는?',
    optionA: '0~127', optionB: '128~191', optionC: '192~223', optionD: '224~239',
    answer: 1, difficulty: 'MEDIUM', topic: '네트워크',
    explanation: '클래스 A: 0~127, 클래스 B: 128~191, 클래스 C: 192~223, 클래스 D: 224~239(멀티캐스트), 클래스 E: 240~255(실험용)입니다.',
    tags: JSON.stringify(['IP주소', '네트워크', '클래스']), sourceNote: '2022년 3회',
  },
  {
    year: 2021, round: 1, subject: '프로그래밍 언어 활용', questionNo: 1,
    content: '운영체제에서 교착 상태(Deadlock) 발생의 필요충분조건이 아닌 것은?',
    optionA: '상호 배제(Mutual Exclusion)', optionB: '점유와 대기(Hold and Wait)',
    optionC: '선점(Preemption)', optionD: '환형 대기(Circular Wait)',
    answer: 3, difficulty: 'HARD', topic: '운영체제',
    explanation: '교착 상태 발생 조건은 상호 배제, 점유와 대기, 비선점(Non-preemption), 환형 대기입니다. 선점(Preemption)이 가능하면 교착 상태가 발생하지 않습니다.',
    tags: JSON.stringify(['교착상태', '운영체제', 'Deadlock']), sourceNote: '2021년 1회',
  },
  {
    year: 2021, round: 2, subject: '프로그래밍 언어 활용', questionNo: 1,
    content: 'Java에서 인터페이스(Interface)에 대한 설명으로 옳지 않은 것은?',
    optionA: '모든 메서드는 기본적으로 public abstract이다',
    optionB: '다중 상속이 가능하다',
    optionC: '인스턴스를 직접 생성할 수 있다',
    optionD: '모든 필드는 기본적으로 public static final이다',
    answer: 3, difficulty: 'MEDIUM', topic: 'Java',
    explanation: '인터페이스(Interface)는 추상 타입으로 인스턴스를 직접 생성할 수 없습니다. 인터페이스를 구현(implements)한 클래스의 인스턴스를 생성해야 합니다.',
    tags: JSON.stringify(['Java', '인터페이스', '객체지향']), sourceNote: '2021년 2회',
  },
  {
    year: 2020, round: 1, subject: '프로그래밍 언어 활용', questionNo: 1,
    content: 'TCP와 UDP에 대한 비교 설명으로 옳지 않은 것은?',
    optionA: 'TCP는 연결 지향형, UDP는 비연결형이다',
    optionB: 'TCP는 신뢰성을 보장하고, UDP는 신뢰성을 보장하지 않는다',
    optionC: 'UDP가 TCP보다 전송 속도가 빠르다',
    optionD: 'TCP는 흐름 제어를 제공하지 않는다',
    answer: 4, difficulty: 'MEDIUM', topic: '네트워크',
    explanation: 'TCP는 흐름 제어(Flow Control)와 혼잡 제어(Congestion Control)를 제공합니다. UDP는 이러한 제어 기능이 없어 빠르지만 신뢰성이 낮습니다.',
    tags: JSON.stringify(['TCP', 'UDP', '네트워크']), sourceNote: '2020년 1회',
  },
  {
    year: 2020, round: 2, subject: '프로그래밍 언어 활용', questionNo: 1,
    content: '다음 C언어 코드에서 포인터 ptr이 가리키는 값은?\n\nint arr[] = {10, 20, 30};\nint *ptr = arr;\nptr++;\nprintf("%d", *ptr);',
    optionA: '10', optionB: '20', optionC: '30', optionD: '주소값',
    answer: 2, difficulty: 'HARD', topic: 'C언어',
    explanation: 'ptr은 처음에 arr[0](값 10)을 가리킵니다. ptr++로 다음 요소인 arr[1]로 이동하고, *ptr은 arr[1]의 값인 20을 반환합니다.',
    tags: JSON.stringify(['C언어', '포인터', '배열']), sourceNote: '2020년 2회',
  },
  {
    year: 2020, round: 3, subject: '프로그래밍 언어 활용', questionNo: 1,
    content: '페이지 교체 알고리즘 중 가장 오랫동안 사용되지 않은 페이지를 교체하는 방식은?',
    optionA: 'FIFO', optionB: 'LRU(Least Recently Used)',
    optionC: 'LFU(Least Frequently Used)', optionD: 'OPT(Optimal)',
    answer: 2, difficulty: 'MEDIUM', topic: '운영체제',
    explanation: 'LRU(최근에 가장 사용되지 않은 페이지 교체)는 최근 참조 시간이 가장 오래된 페이지를 교체합니다. OPT는 이상적이지만 실제 구현이 불가합니다.',
    tags: JSON.stringify(['페이지교체', '운영체제', 'LRU']), sourceNote: '2020년 3회',
  },

  // ──────────────────────────────────────────────
  // 정보시스템 구축 관리 (20문제)
  // ──────────────────────────────────────────────
  {
    year: 2023, round: 1, subject: '정보시스템 구축 관리', questionNo: 1,
    content: '소프트웨어 생명주기 모델 중 폭포수(Waterfall) 모델의 단계를 순서대로 나열한 것은?',
    optionA: '분석→설계→구현→테스트→유지보수',
    optionB: '설계→분석→구현→테스트→유지보수',
    optionC: '분석→구현→설계→테스트→유지보수',
    optionD: '분석→설계→테스트→구현→유지보수',
    answer: 1, difficulty: 'EASY', topic: '소프트웨어 공학',
    explanation: '폭포수 모델의 순서: 요구사항 분석 → 설계 → 구현(코딩) → 테스트 → 유지보수. 각 단계가 완료된 후 다음 단계로 순차적으로 진행됩니다.',
    tags: JSON.stringify(['SDLC', '폭포수모델', '개발방법론']), sourceNote: '2023년 1회',
  },
  {
    year: 2022, round: 3, subject: '정보시스템 구축 관리', questionNo: 1,
    content: '다음 중 대칭키 암호화 알고리즘이 아닌 것은?',
    optionA: 'DES', optionB: 'AES', optionC: 'RSA', optionD: 'ARIA',
    answer: 3, difficulty: 'MEDIUM', topic: '보안',
    explanation: 'RSA는 공개키(비대칭키) 암호화 알고리즘입니다. DES, AES, ARIA, SEED는 모두 대칭키 암호화 알고리즘입니다.',
    tags: JSON.stringify(['암호화', '대칭키', 'RSA']), sourceNote: '2022년 3회',
  },
  {
    year: 2023, round: 2, subject: '정보시스템 구축 관리', questionNo: 1,
    content: 'IT 서비스 관리를 위한 모범 사례 프레임워크로 서비스 전략, 설계, 전환, 운영, 지속적 개선의 5단계 라이프사이클을 제공하는 것은?',
    optionA: 'CMMI', optionB: 'ITIL', optionC: 'ISO 9001', optionD: 'COBIT',
    answer: 2, difficulty: 'MEDIUM', topic: 'IT 거버넌스',
    explanation: 'ITIL(IT Infrastructure Library)은 IT 서비스 관리 모범 사례 프레임워크로, 서비스 전략·설계·전환·운영·지속적 개선의 5단계로 구성됩니다.',
    tags: JSON.stringify(['ITIL', 'IT서비스관리', '거버넌스']), sourceNote: '2023년 2회',
  },
  {
    year: 2022, round: 1, subject: '정보시스템 구축 관리', questionNo: 1,
    content: '네트워크 침입 탐지 시스템(IDS)과 침입 방지 시스템(IPS)의 가장 큰 차이점은?',
    optionA: 'IDS는 실시간 탐지가 가능하나 IPS는 불가능하다',
    optionB: 'IPS는 탐지뿐만 아니라 침입을 차단하는 기능을 한다',
    optionC: 'IDS는 네트워크 기반, IPS는 호스트 기반이다',
    optionD: 'IPS는 수동형, IDS는 능동형으로 동작한다',
    answer: 2, difficulty: 'MEDIUM', topic: '보안',
    explanation: 'IDS(침입 탐지 시스템)는 침입을 탐지하여 경고만 합니다. IPS(침입 방지 시스템)는 탐지 후 실시간으로 침입을 차단하는 능동적 대응 기능을 포함합니다.',
    tags: JSON.stringify(['IDS', 'IPS', '네트워크보안']), sourceNote: '2022년 1회',
  },
  {
    year: 2022, round: 2, subject: '정보시스템 구축 관리', questionNo: 1,
    content: '프로젝트 일정 관리 기법 중 크리티컬 패스(Critical Path)에 대한 설명으로 옳은 것은?',
    optionA: '프로젝트에서 가장 비용이 많이 드는 경로',
    optionB: '가장 위험 요소가 많은 작업의 경로',
    optionC: '프로젝트 완료에 영향을 주는 가장 긴 경로',
    optionD: '리소스가 가장 많이 필요한 경로',
    answer: 3, difficulty: 'MEDIUM', topic: '프로젝트 관리',
    explanation: '크리티컬 패스(Critical Path)는 프로젝트의 시작부터 끝까지 가장 긴 경로로, 이 경로의 작업이 지연되면 전체 프로젝트 일정이 지연됩니다.',
    tags: JSON.stringify(['프로젝트관리', 'CPM', '일정관리']), sourceNote: '2022년 2회',
  },
  {
    year: 2021, round: 1, subject: '정보시스템 구축 관리', questionNo: 1,
    content: '클라우드 컴퓨팅 서비스 모델 중 인프라(서버, 스토리지, 네트워크)만을 제공하는 서비스는?',
    optionA: 'SaaS(Software as a Service)',
    optionB: 'PaaS(Platform as a Service)',
    optionC: 'IaaS(Infrastructure as a Service)',
    optionD: 'DaaS(Desktop as a Service)',
    answer: 3, difficulty: 'EASY', topic: 'IT 거버넌스',
    explanation: 'IaaS는 가상화된 컴퓨팅 인프라(서버, 스토리지, 네트워크)를 제공합니다. PaaS는 개발 플랫폼, SaaS는 완성된 소프트웨어 애플리케이션을 제공합니다.',
    tags: JSON.stringify(['클라우드', 'IaaS', 'SaaS', 'PaaS']), sourceNote: '2021년 1회',
  },
  {
    year: 2021, round: 2, subject: '정보시스템 구축 관리', questionNo: 1,
    content: 'SQL Injection 공격에 대한 방어 방법으로 가장 적절한 것은?',
    optionA: '입력값의 길이를 제한한다',
    optionB: '준비된 구문(Prepared Statement)을 사용한다',
    optionC: '특수문자를 모두 삭제한다',
    optionD: '데이터베이스 접근 로그를 기록한다',
    answer: 2, difficulty: 'MEDIUM', topic: '보안',
    explanation: 'Prepared Statement(매개변수화된 쿼리)는 SQL 쿼리와 데이터를 분리하여 처리하므로 SQL Injection 공격을 가장 효과적으로 방어합니다.',
    tags: JSON.stringify(['SQL Injection', '보안', 'Prepared Statement']), sourceNote: '2021년 2회',
  },
  {
    year: 2020, round: 1, subject: '정보시스템 구축 관리', questionNo: 1,
    content: '소프트웨어 능력 성숙도 모델(CMMI)의 성숙도 레벨 중 정량적으로 프로세스를 관리하는 단계는?',
    optionA: '2단계 (관리됨)', optionB: '3단계 (정의됨)',
    optionC: '4단계 (정량적으로 관리됨)', optionD: '5단계 (최적화)',
    answer: 3, difficulty: 'MEDIUM', topic: 'IT 거버넌스',
    explanation: 'CMMI 4단계는 정량적 관리(Quantitatively Managed) 단계로, 측정 데이터를 기반으로 프로세스를 통계적으로 관리합니다. 5단계는 지속적 최적화 단계입니다.',
    tags: JSON.stringify(['CMMI', '성숙도모델', '프로세스']), sourceNote: '2020년 1회',
  },
  {
    year: 2020, round: 2, subject: '정보시스템 구축 관리', questionNo: 1,
    content: '다음 중 XSS(Cross-Site Scripting) 공격을 방지하기 위한 방법으로 옳은 것은?',
    optionA: '입력값에 HTML 특수문자를 이스케이프 처리한다',
    optionB: '데이터베이스 접근을 암호화한다',
    optionC: '모든 HTTP 요청에 인증 토큰을 추가한다',
    optionD: '입력값의 길이만 제한한다',
    answer: 1, difficulty: 'MEDIUM', topic: '보안',
    explanation: 'XSS 방지를 위해 출력 시 HTML 특수문자(<, >, &, ", \')를 이스케이프 처리합니다. 인증 토큰 추가는 CSRF 방지 방법입니다.',
    tags: JSON.stringify(['XSS', '보안', '웹보안']), sourceNote: '2020년 2회',
  },
  {
    year: 2020, round: 3, subject: '정보시스템 구축 관리', questionNo: 1,
    content: '소프트웨어 유지보수 유형 중 오류 수정을 목적으로 하는 유지보수는?',
    optionA: '수정(Corrective) 유지보수', optionB: '적응(Adaptive) 유지보수',
    optionC: '완전(Perfective) 유지보수', optionD: '예방(Preventive) 유지보수',
    answer: 1, difficulty: 'EASY', topic: '소프트웨어 공학',
    explanation: '수정 유지보수는 발견된 오류(버그)를 수정하는 유지보수입니다. 적응은 환경 변화 대응, 완전은 기능 향상, 예방은 미래 오류 방지가 목적입니다.',
    tags: JSON.stringify(['유지보수', '소프트웨어공학']), sourceNote: '2020년 3회',
  },
]

async function main() {
  console.log('Seeding database...')

  const hashedPw = await bcrypt.hash('gisa1234', 10)
  const user = await prisma.user.upsert({
    where: { email: 'test@gisa.local' },
    create: { email: 'test@gisa.local', name: '정기사', password: hashedPw },
    update: {},
  })
  console.log(`✓ User: ${user.email}`)

  let created = 0
  for (const q of questions) {
    try {
      await prisma.question.upsert({
        where: { year_round_subject_questionNo: { year: q.year, round: q.round, subject: q.subject, questionNo: q.questionNo } },
        create: q,
        update: {},
      })
      created++
    } catch {
      // 중복 스킵
    }
  }

  console.log(`✓ Questions: ${created}/${questions.length}개 생성`)
  console.log('\n✅ 시딩 완료!')
  console.log('로그인: test@gisa.local / gisa1234')
  console.log(`총 문제: ${await prisma.question.count()}개`)
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())
