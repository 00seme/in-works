import { toPng } from 'https://cdn.jsdelivr.net/npm/html-to-image@1.11.11/+esm';

const defaults = {
  brickMode: 'texture',
  marbleMode: 'texture',
  brickColor: '#8f755c',
  brickSolidColor: '#836b58',
  brickBlend: 0,
  brickPosX: 0,
  brickPosY: 0,
  marbleColor: '#ffffff',
  marbleSolidColor: '#f1f1f1',
  marbleBlend: 0,
  marblePosX: 0,
  marblePosY: 0,
  pinColor: '#4f4f4f',
  markerColor: '#4f4f4f',
  pillColor: '#595959',
  pillTextColor: '#ffffff',
  relationCharacterColor: '#cfcfcf',
  checkColor: '#555555',
  lineColor: '#8a8a8a',
  name: '캐릭터 이름',
  engName: 'name',
  summary: '캐릭터의 간단한 개요 설명',
  keyword1: '키워드',
  keyword2: '키워드',
  mainImagePosX: 0,
  mainImagePosY: 0,
  mainImageScale: 100,
  brickScale: 100,
  marbleScale: 100,
  subImagePosX: 0,
  subImagePosY: 0,
  subImageScale: 100,
  paperColor: '#ffffff',
  cardTextColor: '#202020',
  sheetTextColor: '#202020',
  brickImage: './assets/brick-default.png',
  marbleImage: './assets/marble-default.png',
  checklists: {
    introChecklist: ['피해자', '의뢰인', '용의자', '조직 관계자', '범인', '주변인', '목격자', '재등장 암시', '참고인', '단역처럼 등장', '수사 관계자', '에피소드 이름'],
    affiliationChecklist: ['위장 신분', '어린이 탐정단', '탐정', '공안', '경시청 경찰', '검은조직', '경찰청 경찰', '학생', '해외 기관', '일반인', '스파이', '기타'],
    timelineChecklist: ['원작 시점', '사망 이전', '원작 과거 시점', '조직 궤멸 이후', '원작 미래 시점', '극장판 기반', '완결 이후 시점', '경찰학교 시절', '생존 IF', '조직 시절']
  }
};

const root = document.documentElement;
const sheet = document.getElementById('sheet');
const topBrick = document.querySelector('.top-brick');
const marbleSurface = document.querySelector('.sheet-curve');
const marbleTargets = [marbleSurface, ...document.querySelectorAll('.marble-bg-sub')];

const elements = {
  brickMode: document.getElementById('brickMode'),
  marbleMode: document.getElementById('marbleMode'),
  brickColor: document.getElementById('brickColor'),
  brickSolidColor: document.getElementById('brickSolidColor'),
  brickPosX: document.getElementById('brickPosX'),
  brickPosY: document.getElementById('brickPosY'),
  brickBlend: document.getElementById('brickBlend'),
  marbleColor: document.getElementById('marbleColor'),
  marbleSolidColor: document.getElementById('marbleSolidColor'),
  marblePosX: document.getElementById('marblePosX'),
  marblePosY: document.getElementById('marblePosY'),
  marbleBlend: document.getElementById('marbleBlend'),
  pinColor: document.getElementById('pinColor'),
  markerColor: document.getElementById('markerColor'),
  pillColor: document.getElementById('pillColor'),
  pillTextColor: document.getElementById('pillTextColor'),
  relationCharacterColor: document.getElementById('relationCharacterColor'),
  checkColor: document.getElementById('checkColor'),
  lineColor: document.getElementById('lineColor'),
  brickUpload: document.getElementById('brickUpload'),
  marbleUpload: document.getElementById('marbleUpload'),
  mainImageInput: document.getElementById('mainImageInput'),
  mainImagePosX: document.getElementById('mainImagePosX'),
  mainImagePosY: document.getElementById('mainImagePosY'),
  mainImageScale: document.getElementById('mainImageScale'),
  brickScale: document.getElementById('brickScale'),
  marbleScale: document.getElementById('marbleScale'),
  subImagePosX: document.getElementById('subImagePosX'),
  subImagePosY: document.getElementById('subImagePosY'),
  subImageScale: document.getElementById('subImageScale'),
  subImageInput: document.getElementById('subImageInput'),
  previewName: document.getElementById('previewName'),
  folderTitle: document.getElementById('folderTitle'),
  previewEngName: document.getElementById('previewEngName'),
  previewSummary: document.getElementById('previewSummary'),
  previewKeyword1: document.getElementById('previewKeyword1'),
  previewKeyword2: document.getElementById('previewKeyword2'),
  relationLinkedName: document.getElementById('relationLinkedName'),
  mainPortrait: document.getElementById('mainPortrait'),
  subPortrait: document.getElementById('subPortrait'),
  paperColor: document.getElementById('paperColor'),
  cardTextColor: document.getElementById('cardTextColor'),
  sheetTextColor: document.getElementById('sheetTextColor'),
  downloadPngBtn: document.getElementById('downloadPngBtn'),
  resetBtn: document.getElementById('resetBtn')
};

let brickImageData = defaults.brickImage;
let marbleImageData = defaults.marbleImage;

function setMode(target, mode, type) {
  const classes = ['texture-mode', 'upload-mode', 'solid-mode', 'none-mode'];
  const classMap = { texture: 'texture-mode', upload: 'upload-mode', solid: 'solid-mode', none: 'none-mode' };

  // upload 모드가 아니면 inline style로 설정된 backgroundImage 초기화
  if (mode !== 'upload') {
    target.style.backgroundImage = '';
    target.style.backgroundSize = '';
    target.style.backgroundRepeat = '';
  }
  target.classList.remove(...classes);
  target.classList.add(classMap[mode]);

  if (type === 'marble') {
    marbleTargets.forEach((node) => {
      if (mode !== 'upload') {
        node.style.backgroundImage = '';
        node.style.backgroundSize = '';
        node.style.backgroundRepeat = '';
      }
      node.classList.remove(...classes);
      node.classList.add(classMap[mode]);
    });
  }
}

let isSyncingName = false;
let isComposingName = false;

function getCleanName(node) {
  return (node.textContent || '').replace(/\s+/g, ' ').trim();
}

function syncNameFrom(sourceNode, { applyDefault = false } = {}) {
  if (isSyncingName || isComposingName) return;

  const typedName = getCleanName(sourceNode);
  const syncedName = typedName || (applyDefault ? defaults.name : '');
  if (!syncedName) return;

  isSyncingName = true;
  try {
    [elements.previewName, elements.folderTitle, elements.relationLinkedName].forEach((node) => {
      if (node === sourceNode) return;
      if (node.textContent !== syncedName) {
        node.textContent = syncedName;
      }
    });

    if (applyDefault && sourceNode.textContent !== syncedName) {
      sourceNode.textContent = syncedName;
    }
  } finally {
    isSyncingName = false;
  }
}

function syncTextInputs() {
  syncNameFrom(elements.previewName, { applyDefault: true });

  if (!elements.previewEngName.textContent.trim()) {
    elements.previewEngName.textContent = defaults.engName;
  }
  if (!elements.previewSummary.textContent.trim()) {
    elements.previewSummary.textContent = defaults.summary;
  }
  if (!elements.previewKeyword1.textContent.trim()) {
    elements.previewKeyword1.textContent = defaults.keyword1;
  }
  if (!elements.previewKeyword2.textContent.trim()) {
    elements.previewKeyword2.textContent = defaults.keyword2;
  }
}

// 가벼운 함수: 색상·위치·크기 CSS var만 업데이트 (이미지 데이터 제외)
function updateColors() {
  root.style.setProperty('--brick-color', elements.brickColor.value);
  root.style.setProperty('--brick-solid-color', elements.brickSolidColor.value);
  root.style.setProperty('--brick-blend-alpha', String(Number(elements.brickBlend.value) / 100));
  root.style.setProperty('--brick-pos-x', `${elements.brickPosX.value}px`);
  root.style.setProperty('--brick-pos-y', `${elements.brickPosY.value}px`);
  root.style.setProperty('--marble-color', elements.marbleColor.value);
  root.style.setProperty('--marble-solid-color', elements.marbleSolidColor.value);
  root.style.setProperty('--marble-blend-alpha', String(Number(elements.marbleBlend.value) / 100));
  root.style.setProperty('--marble-pos-x', `${elements.marblePosX.value}px`);
  root.style.setProperty('--marble-pos-y', `${elements.marblePosY.value}px`);
  root.style.setProperty('--pin-color', elements.pinColor.value);
  root.style.setProperty('--marker-color', elements.markerColor.value);
  root.style.setProperty('--pill-color', elements.pillColor.value);
  root.style.setProperty('--pill-text-color', elements.pillTextColor.value);
  root.style.setProperty('--relation-character-color', elements.relationCharacterColor.value);
  root.style.setProperty('--check-color', elements.checkColor.value);
  root.style.setProperty('--line-color', elements.lineColor.value);
  root.style.setProperty('--paper-color', elements.paperColor.value);
  root.style.setProperty('--card-text-color', elements.cardTextColor.value);
  root.style.setProperty('--sheet-text-color', elements.sheetTextColor.value);
  root.style.setProperty('--main-image-pos-x', `${elements.mainImagePosX.value}px`);
  root.style.setProperty('--main-image-pos-y', `${elements.mainImagePosY.value}px`);
  root.style.setProperty('--main-image-scale', String(Number(elements.mainImageScale.value) / 100));
  root.style.setProperty('--brick-scale', String(Number(elements.brickScale.value) / 100));
  root.style.setProperty('--marble-scale', String(Number(elements.marbleScale.value) / 100));
  root.style.setProperty('--sub-image-pos-x', `${elements.subImagePosX.value}px`);
  root.style.setProperty('--sub-image-pos-y', `${elements.subImagePosY.value}px`);
  root.style.setProperty('--sub-image-scale', String(Number(elements.subImageScale.value) / 100));
}

// 무거운 함수: 이미지 데이터 + 모드 변경 포함 (업로드·모드 변경 시만 호출)
function updateTheme() {
  updateColors();
  root.style.setProperty('--brick-image', `url('${brickImageData}')`);
  root.style.setProperty('--marble-image', `url('${marbleImageData}')`);
  setMode(topBrick, elements.brickMode.value, 'brick');
  setMode(marbleSurface, elements.marbleMode.value, 'marble');
}

function updateImage(imgEl, fileData) {
  const frame = imgEl.parentElement;
  if (!fileData) {
    imgEl.removeAttribute('src');
    frame.classList.remove('has-image');
    return;
  }
  imgEl.src = fileData;
  frame.classList.add('has-image');
}

function readFileAsDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

async function handleUpload(input, callback) {
  const file = input.files?.[0];
  if (!file) return;
  const data = await readFileAsDataUrl(file);
  callback(data);
}

function bindEditableSync() {
  [elements.previewName, elements.folderTitle, elements.relationLinkedName].forEach((node) => {
    node.addEventListener('compositionstart', () => {
      isComposingName = true;
    });

    node.addEventListener('compositionend', () => {
      isComposingName = false;
      syncNameFrom(node);
    });

    node.addEventListener('input', () => {
      if (isComposingName) return;
      syncNameFrom(node);
    });

    node.addEventListener('blur', () => {
      syncNameFrom(node, { applyDefault: true });
    });
  });

  [elements.previewEngName, elements.previewSummary, elements.previewKeyword1, elements.previewKeyword2].forEach((node) => {
    node.addEventListener('blur', syncTextInputs);
  });
}


function createChecklist(containerId, items) {
  const container = document.getElementById(containerId);
  container.innerHTML = '';
  items.forEach((label) => {
    const item = document.createElement('div');
    item.className = 'check-item';

    const toggle = document.createElement('button');
    toggle.className = 'check-toggle';
    toggle.type = 'button';
    toggle.setAttribute('aria-label', `${label} 체크`);
    toggle.addEventListener('click', () => item.classList.toggle('checked'));

    const text = document.createElement('div');
    text.className = 'check-text';
    text.contentEditable = 'true';
    text.textContent = label;

    item.append(toggle, text);
    container.append(item);
  });
}

function buildAllChecklists() {
  Object.entries(defaults.checklists).forEach(([id, items]) => createChecklist(id, items));
}

async function downloadPng() {
  const btn = elements.downloadPngBtn;
  btn.disabled = true;
  btn.textContent = '저장 중...';
  try {
    const dataUrl = await toPng(sheet, {
      cacheBust: true,
      pixelRatio: 2,
      skipFonts: false,
      width: 980,
      height: sheet.scrollHeight,
      style: { boxShadow: 'none' }
    });
    const link = document.createElement('a');
    link.href = dataUrl;
    link.download = 'oc-sheet.png';
    link.click();
  } catch (error) {
    console.error(error);
    alert('PNG 저장에 실패했습니다.');
  } finally {
    btn.disabled = false;
    btn.textContent = 'PNG 저장';
  }
}

function resetAll() {
  elements.brickMode.value = defaults.brickMode;
  elements.marbleMode.value = defaults.marbleMode;
  elements.brickColor.value = defaults.brickColor;
  elements.brickSolidColor.value = defaults.brickSolidColor;
  elements.brickPosX.value = defaults.brickPosX;
  elements.brickPosY.value = defaults.brickPosY;
  elements.brickBlend.value = defaults.brickBlend;
  elements.marbleColor.value = defaults.marbleColor;
  elements.marbleSolidColor.value = defaults.marbleSolidColor;
  elements.marblePosX.value = defaults.marblePosX;
  elements.marblePosY.value = defaults.marblePosY;
  elements.marbleBlend.value = defaults.marbleBlend;
  elements.pinColor.value = defaults.pinColor;
  elements.markerColor.value = defaults.markerColor;
  elements.pillColor.value = defaults.pillColor;
  elements.pillTextColor.value = defaults.pillTextColor;
  elements.relationCharacterColor.value = defaults.relationCharacterColor;
  elements.checkColor.value = defaults.checkColor;
  elements.lineColor.value = defaults.lineColor;
  elements.paperColor.value = defaults.paperColor;
  elements.cardTextColor.value = defaults.cardTextColor;
  elements.sheetTextColor.value = defaults.sheetTextColor;
  elements.previewName.textContent = defaults.name;
  elements.folderTitle.textContent = defaults.name;
  elements.relationLinkedName.textContent = defaults.name;
  elements.previewEngName.textContent = defaults.engName;
  elements.previewSummary.textContent = defaults.summary;
  elements.previewKeyword1.textContent = defaults.keyword1;
  elements.previewKeyword2.textContent = defaults.keyword2;
  elements.mainImagePosX.value = defaults.mainImagePosX;
  elements.brickScale.value = defaults.brickScale;
  elements.marbleScale.value = defaults.marbleScale;
  elements.subImagePosX.value = defaults.subImagePosX;
  elements.subImagePosY.value = defaults.subImagePosY;
  elements.subImageScale.value = defaults.subImageScale;
  elements.mainImagePosY.value = defaults.mainImagePosY;
  elements.mainImageScale.value = defaults.mainImageScale;
  brickImageData = defaults.brickImage;
  marbleImageData = defaults.marbleImage;
  syncTextInputs();
  buildAllChecklists();
  updateImage(elements.mainPortrait, null);
  updateImage(elements.subPortrait, null);
  elements.mainImageInput.value = '';
  elements.subImageInput.value = '';
  elements.brickUpload.value = '';
  elements.marbleUpload.value = '';
  updateTheme();
}

// 색상·위치 → updateColors() (이미지 데이터 재설정 없이 빠름)
['mainImagePosX','mainImagePosY','mainImageScale',
 'brickColor','brickSolidColor','brickPosX','brickPosY','brickBlend',
 'marbleColor','marbleSolidColor','marblePosX','marblePosY','marbleBlend',
 'pinColor','markerColor','pillColor','pillTextColor',
 'relationCharacterColor','checkColor','lineColor',
 'paperColor','cardTextColor','sheetTextColor',
 'brickScale','marbleScale',
 'subImagePosX','subImagePosY','subImageScale',
].forEach(key => {
  elements[key].addEventListener('input', updateColors);
});

// 모드 변경 → updateTheme() (setMode 포함)
elements.brickMode.addEventListener('change', updateTheme);
elements.marbleMode.addEventListener('change', updateTheme);

elements.mainImageInput.addEventListener('change', async () => {
  await handleUpload(elements.mainImageInput, (data) => updateImage(elements.mainPortrait, data));
});

elements.subImageInput.addEventListener('change', async () => {
  await handleUpload(elements.subImageInput, (data) => updateImage(elements.subPortrait, data));
});

elements.brickUpload.addEventListener('change', async () => {
  await handleUpload(elements.brickUpload, (data) => {
    brickImageData = data;
    elements.brickMode.value = 'upload';
    // CSS var 대신 직접 style 적용 (base64가 길어서 var()가 안 먹히는 브라우저 대응)
    topBrick.style.backgroundImage = `url('${data}')`;
    topBrick.style.backgroundSize = `calc(var(--brick-scale) * 100%) auto`;
    topBrick.style.backgroundRepeat = 'no-repeat';
    topBrick.style.backgroundPosition = `calc(50% + var(--brick-pos-x)) calc(50% + var(--brick-pos-y))`;
    const classes = ['texture-mode','upload-mode','solid-mode','none-mode'];
    topBrick.classList.remove(...classes);
    topBrick.classList.add('upload-mode');
    updateTheme();
  });
});

elements.marbleUpload.addEventListener('change', async () => {
  await handleUpload(elements.marbleUpload, (data) => {
    marbleImageData = data;
    elements.marbleMode.value = 'upload';
    // 마블(배경B) 모든 타깃에 직접 적용
    const classes = ['texture-mode','upload-mode','solid-mode','none-mode'];
    marbleTargets.forEach(node => {
      node.style.backgroundImage = `url('${data}')`;
      node.style.backgroundSize = `calc(var(--marble-scale) * 100%) auto`;
      node.style.backgroundRepeat = 'no-repeat';
      node.style.backgroundPosition = `calc(50% + var(--marble-pos-x)) calc(50% + var(--marble-pos-y))`;
      node.classList.remove(...classes);
      node.classList.add('upload-mode');
    });
    updateTheme();
  });
});

document.querySelectorAll('[data-clear-image]').forEach((btn) => {
  btn.addEventListener('click', () => {
    if (btn.dataset.clearImage === 'main') {
      updateImage(elements.mainPortrait, null);
      elements.mainImageInput.value = '';
    } else {
      updateImage(elements.subPortrait, null);
      elements.subImageInput.value = '';
    }
  });
});

elements.downloadPngBtn.addEventListener('click', downloadPng);
elements.resetBtn.addEventListener('click', resetAll);

buildAllChecklists();
bindEditableSync();
syncTextInputs();
updateTheme();

// ── 메인 프로필 직접 드래그 & 스크롤 조작 ──────────────────────
(function initPortraitDrag() {
  const portrait = document.querySelector('.main-portrait');
  let dragging = false;
  let startX = 0, startY = 0;
  let basePosX = 0, basePosY = 0;

  function getPosX() { return Number(elements.mainImagePosX.value); }
  function getPosY() { return Number(elements.mainImagePosY.value); }

  portrait.addEventListener('mousedown', (e) => {
    if (!portrait.classList.contains('has-image')) return;
    dragging = true;
    startX = e.clientX;
    startY = e.clientY;
    basePosX = getPosX();
    basePosY = getPosY();
    portrait.classList.add('dragging');
    e.preventDefault();
  });

  window.addEventListener('mousemove', (e) => {
    if (!dragging) return;
    const dx = e.clientX - startX;
    const dy = e.clientY - startY;
    const newX = Math.max(-200, Math.min(200, basePosX + dx));
    const newY = Math.max(-200, Math.min(200, basePosY + dy));
    elements.mainImagePosX.value = newX;
    elements.mainImagePosY.value = newY;
    updateColors();
  });

  window.addEventListener('mouseup', () => {
    if (dragging) {
      dragging = false;
      portrait.classList.remove('dragging');
    }
  });

  portrait.addEventListener('wheel', (e) => {
    if (!portrait.classList.contains('has-image')) return;
    e.preventDefault();
    const delta = e.deltaY < 0 ? 5 : -5;
    const current = Number(elements.mainImageScale.value);
    elements.mainImageScale.value = Math.max(50, Math.min(180, current + delta));
    updateTheme();
  }, { passive: false });
}());


document.querySelectorAll('.control-section').forEach((section) => {
  const toggleLabel = section.querySelector('.section-toggle');
  const refresh = () => {
    if (!toggleLabel) return;
    toggleLabel.textContent = section.open ? '접기' : '펼치기';
  };
  section.addEventListener('toggle', refresh);
  refresh();
});

    