# OC 틀 메이커

정적 HTML/CSS/JS만으로 만든 OC 시트 편집기입니다. GitHub Pages에 그대로 올려서 사용할 수 있습니다.

## 포함 기능

- 시트 내용을 브라우저에서 직접 수정
- PNG 추출
- 벽돌 배경:
  - 기본 텍스처 + 색상 변경
  - 업로드 이미지로 교체
  - 텍스처 제거 후 단색 채우기
  - 완전 제거
- 대리석 배경:
  - 기본 텍스처 + 색상 변경
  - 업로드 이미지로 교체
  - 텍스처 제거 후 단색 채우기
  - 완전 제거
- 압정 / 느낌표 / 라벨 색상 변경
- 메인 이미지 / 관계 이미지 업로드

## 파일 구조

- `index.html`
- `style.css`
- `script.js`
- `assets/brick-default.png`
- `assets/marble-default.png`
- `assets/pin.png`
- `assets/exclamation.png`

## GitHub Pages 배포 방법

1. 새 GitHub 저장소 생성
2. 이 폴더의 파일을 그대로 업로드
3. GitHub 저장소의 **Settings → Pages**로 이동
4. **Build and deployment**에서 **Deploy from a branch** 선택
5. 브랜치를 `main`, 폴더를 `/ (root)`로 선택 후 저장
6. 잠시 뒤 배포 주소가 생성됨

## 수정 팁

- 기본 배경 이미지를 바꾸려면 `assets` 폴더의 PNG 파일을 교체하면 됩니다.
- 시트 레이아웃을 더 바꾸고 싶으면 `index.html`과 `style.css`를 수정하면 됩니다.
- export 품질은 `script.js`의 `pixelRatio` 값으로 조절할 수 있습니다.
