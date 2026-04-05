---
name: 스킬 설치 시 .agents 폴더 생성 금지
description: npx skills add 사용 시 .agents 폴더 대신 .claude/skills에 직접 설치할 것
type: feedback
---

스킬 설치 시 `.agents` 폴더를 생성하지 말고 `.claude/skills/` 폴더에 직접 설치해야 한다.

**Why:** `npx skills add`는 기본적으로 `.agents/skills/`에 파일을 설치하고 `.claude/skills/`에 심볼릭 링크를 생성하는데, 사용자는 이 구조를 원하지 않음. 불필요한 `.agents` 폴더가 프로젝트 루트에 생기는 것을 싫어함.

**How to apply:** 스킬 설치 시 다음 절차를 따를 것:
1. `npx skills add <패키지> -y`로 설치 (기본 동작으로 .agents에 설치됨)
2. `.claude/skills/`의 심볼릭 링크를 삭제
3. `.agents/skills/`에서 `.claude/skills/`로 실제 파일을 복사 (`cp -r`)
4. `.agents` 폴더 삭제 (`rm -rf .agents`)
