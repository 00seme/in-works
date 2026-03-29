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
  brickImage: './assets/brick-default.png',
  marbleImage: './assets/marble-default.png',
  checklists: {
    introChecklist: ['피해자', '의뢰인', '용의자', '조직 관계자', '범인', '주변인', '목격자', '재등장 암시', '참고인', '단역+전환', '수사 관계자', '에피소드 이름'],
    affiliationChecklist: ['위장 신분', '코어', '탐정', '공안', '경시청 경찰', '검은조직', '경찰청 경찰', '학생', '해외 기관', '일반인', '스파이', '고위 관료 자제'],
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
  downloadPngBtn: document.getElementById('downloadPngBtn'),
  resetBtn: document.getElementById('resetBtn')
};

let brickImageData = defaults.brickImage;
let marbleImageData = defaults.marbleImage;

function setMode(target, mode, type) {
  const classes = ['texture-mode', 'upload-mode', 'solid-mode', 'none-mode'];
  target.classList.remove(...classes);
  const classMap = { texture: 'texture-mode', upload: 'upload-mode', solid: 'solid-mode', none: 'none-mode' };
  target.classList.add(classMap[mode]);

  if (type === 'marble') {
    marbleTargets.forEach((node) => {
      node.classList.remove(...classes);
      node.classList.add(classMap[mode]);
    });
  }
}

let isSyncingName = false;

function syncNameFrom(sourceNode) {
  if (isSyncingName) return;
  isSyncingName = true;
  const syncedName = sourceNode.textContent.trim() || defaults.name;
  elements.previewName.textContent = syncedName;
  elements.folderTitle.textContent = syncedName;
  elements.relationLinkedName.textContent = syncedName;
  isSyncingName = false;
}

function syncTextInputs() {
  syncNameFrom(elements.previewName);

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

function updateTheme() {
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
  root.style.setProperty('--main-image-pos-x', `${elements.mainImagePosX.value}px`);
  root.style.setProperty('--main-image-pos-y', `${elements.mainImagePosY.value}px`);
  root.style.setProperty('--main-image-scale', String(Number(elements.mainImageScale.value) / 100));
  root.style.setProperty('--brick-image', `url('${brickImageData}')`);
  root.style.setProperty('--marble-image', `url('${marbleImageData}')`);
  setMode(topBrick, elements.brickMode.value, 'brick');
  setMode(sheet, elements.marbleMode.value, 'marble');
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
  elements.previewName.addEventListener('input', syncNameFromPreview);
  elements.previewName.addEventListener('blur', syncTextInputs);

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
  const originalBoxShadow = sheet.style.boxShadow;
  sheet.style.boxShadow = 'none';
  try {
    const EXPORT_WIDTH = 1000;
    const EXPORT_HEIGHT = 1833;
    const dataUrl = await toPng(sheet, {
      cacheBust: true,
      pixelRatio: 1,
      skipFonts: false,
      canvasWidth: EXPORT_WIDTH,
      canvasHeight: EXPORT_HEIGHT,
      width: sheet.scrollWidth,
      height: sheet.scrollHeight,
      style: {
        transform: 'scale(1)',
        transformOrigin: 'top left'
      }
    });
    const link = document.createElement('a');
    link.href = dataUrl;
    link.download = 'oc-sheet.png';
    link.click();
  } catch (error) {
    console.error(error);
    alert('PNG 저장에 실패했습니다. 이미지가 너무 크거나 브라우저 메모리가 부족할 수 있습니다.');
  } finally {
    sheet.style.boxShadow = originalBoxShadow;
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
  elements.previewName.textContent = defaults.name;
  elements.folderTitle.textContent = defaults.name;
  elements.relationLinkedName.textContent = defaults.name;
  elements.previewEngName.textContent = defaults.engName;
  elements.previewSummary.textContent = defaults.summary;
  elements.previewKeyword1.textContent = defaults.keyword1;
  elements.previewKeyword2.textContent = defaults.keyword2;
  elements.mainImagePosX.value = defaults.mainImagePosX;
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

Object.entries({
  mainImagePosX: 'input',
  mainImagePosY: 'input',
  mainImageScale: 'input',
  brickMode: 'change',
  marbleMode: 'change',
  brickColor: 'input',
  brickSolidColor: 'input',
  brickPosX: 'input',
  brickPosY: 'input',
  brickBlend: 'input',
  marbleColor: 'input',
  marbleSolidColor: 'input',
  marblePosX: 'input',
  marblePosY: 'input',
  marbleBlend: 'input',
  pinColor: 'input',
  markerColor: 'input',
  pillColor: 'input',
  pillTextColor: 'input',
  relationCharacterColor: 'input',
  checkColor: 'input',
  lineColor: 'input'
}).forEach(([key, eventName]) => {
  elements[key].addEventListener(eventName, () => {
    updateTheme();
  });
});

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
    updateTheme();
  });
});

elements.marbleUpload.addEventListener('change', async () => {
  await handleUpload(elements.marbleUpload, (data) => {
    marbleImageData = data;
    elements.marbleMode.value = 'upload';
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


document.querySelectorAll('.control-section').forEach((section) => {
  const toggleLabel = section.querySelector('.section-toggle');
  const refresh = () => {
    if (!toggleLabel) return;
    toggleLabel.textContent = section.open ? '접기' : '펼치기';
  };
  section.addEventListener('toggle', refresh);
  refresh();
});
