```
/app
└── /components
├── /pages
│ ├── columns.tsx # 컬럼 정의
│ └── data-table-row-actions.tsx # 행(row)별 액션 메뉴
└── page.tsx # 실제 페이지 컴포넌트

/components
└── /ui
├── data-table.tsx # 공통 데이터 테이블
├── data-table-pagination.tsx # 페이지네이션
├── data-table-toolbar.tsx # 툴바
├── data-table-column-header.tsx # 컬럼 헤더

```

### 실제 작업할 곳은 columns에서 Tbody에 랜더링될 데이터를 가공해주면 됩니다.

## 📄 컬럼 정의 (columns.tsx) 의 역할과 사용법

API 등에서 가져온 원본 데이터(raw data) 배열을 DataTable 컴포넌트에 전달했을 때,<br/>
이 설계도를 참고하여 테이블의 각 열(column)과 행(row)을 어떻게 그려낼지 결정합니다.<br/>
원본 데이터를 기반으로 실제 화면에 표시될 HTML 또는 React 컴포넌트를 생성하는 작업을 이곳에서 담당합니다.

### 핵심 역할

columns.tsx 파일의 columns 배열은 ColumnDef 객체들의 리스트입니다. 각 객체는 테이블의 한 열을 정의하며, 주로 다음과 같은 속성을 가집니다.

#### 1. 데이터 연결 (accessorKey)

테이블의 특정 열과 데이터 객체의 어떤 key를 연결할지 지정합니다.<br/>

예시: accessorKey: 'title' 이라고 설정하면, 해당 열은 data 배열에 있는 각 객체의 title 프로퍼티 값을 표시하게 됩니다.

#### 2. 헤더 스타일링 및 기능 (header)

열의 제목(헤더) 부분을 어떻게 렌더링할지 정의합니다.<br/>

단순 텍스트로 표시할 수도 있고, 정렬(sorting) 기능이 포함된 별도의 DataTableColumnHeader 같은 React 컴포넌트를 사용하여 렌더링할 수도 있습니다.

#### 3. 셀 데이터 커스터마이징 (cell)

가장 중요한 부분으로, 각 셀(cell)의 내용을 어떻게 보여줄지 자유롭게 커스터마이징할 수 있습니다. <br/>
cell 함수는 row 정보를 인자로 받아, 원본 데이터 값(row.getValue('key') 또는 row.original)에 접근할 수 있습니다.<br/>
이 값을 사용하여 단순 텍스트가 아닌, 특정 조건에 따라 다른 색상의 뱃지(Badge), 버튼, 이미지, 체크박스 등 원하는 React 컴포넌트를 반환할 수 있습니다.<br/>
예를 들어, status 값이 'done'이면 초록색 뱃지를, 'pending'이면 노란색 뱃지를 보여주는 로직을 이 곳에서 구현합니다.

#### 4. 액션 컬럼 정의 (id & cell)

데이터 객체와 직접적인 관련은 없지만, '수정', '삭제' 버튼처럼 각 행에 대한 특정 액션을 수행하는 열을 추가할 때 사용됩니다.<br/>
accessorKey 대신 고유한 id를 부여합니다.<br/>
cell 함수 안에서 DataTableRowActions 와 같은 컴포넌트를 렌더링하여 드롭다운 메뉴나 버튼 그룹을 표시합니다.
