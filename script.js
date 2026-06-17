/* ===== Navigation ===== */
document.addEventListener('DOMContentLoaded', () => {
  // Tool switching
  document.querySelectorAll('[data-tool]').forEach(el => {
    el.addEventListener('click', e => {
      e.preventDefault();
      const tool = el.dataset.tool;
      if (tool === 'home') { showHome(); return }
      const section = document.getElementById('tool-' + tool);
      if (section) {
        document.querySelectorAll('.tool-section').forEach(s => s.classList.remove('active'));
        section.classList.add('active');
        document.querySelectorAll('.nav-link').forEach(n => n.classList.remove('active'));
        const navLink = document.querySelector(`.nav-link[data-tool="${tool}"]`);
        if (!navLink) addNavLink(tool, el.querySelector('h3')?.textContent || tool);
        document.querySelector(`.nav-link[data-tool="${tool}"]`)?.classList.add('active');
        window.scrollTo({top: 0, behavior: 'smooth'});
      }
    });
  });

  function showHome() {
    document.querySelectorAll('.tool-section').forEach(s => s.classList.remove('active'));
    document.getElementById('tool-home').classList.add('active');
    document.querySelectorAll('.nav-link').forEach(n => n.classList.remove('active'));
    const homeLink = document.querySelector('.nav-link[data-tool="home"]');
    if (homeLink) homeLink.classList.add('active');
    window.scrollTo({top: 0, behavior: 'smooth'});
  }

  function addNavLink(toolId, label) {
    const nav = document.getElementById('mainNav');
    const link = document.createElement('a');
    link.href = '#'; link.className = 'nav-link'; link.dataset.tool = toolId;
    link.textContent = label;
    link.addEventListener('click', e => {
      e.preventDefault();
      document.querySelectorAll('.tool-section').forEach(s => s.classList.remove('active'));
      document.getElementById('tool-' + toolId)?.classList.add('active');
      document.querySelectorAll('.nav-link').forEach(n => n.classList.remove('active'));
      link.classList.add('active');
      if (window.innerWidth <= 768) document.getElementById('mainNav')?.classList.remove('open');
      window.scrollTo({top: 0, behavior: 'smooth'});
    });
    nav.appendChild(link);
  }

  // Mobile menu
  document.getElementById('mobileMenuBtn')?.addEventListener('click', () => {
    document.getElementById('mainNav')?.classList.toggle('open');
  });
});

/* ===== 1. Image Compressor ===== */
(function(){
  const uploadZone = document.getElementById('imgUploadZone');
  const imgInput = document.getElementById('imgInput');
  const result = document.getElementById('imgResult');
  const originalImg = document.getElementById('imgOriginal');
  const compressedImg = document.getElementById('imgCompressed');
  const originalInfo = document.getElementById('imgOriginalInfo');
  const compressedInfo = document.getElementById('imgCompressedInfo');
  const qualitySlider = document.getElementById('qualitySlider');
  const qualityLabel = document.getElementById('qualityLabel');
  const downloadBtn = document.getElementById('downloadImgBtn');

  let currentFile = null;
  let compressedBlob = null;

  function handleFile(file) {
    if (!file || !file.type.match(/image\/(png|jpeg|webp)/)) {
      alert('请上传 PNG / JPG / WebP 格式的图片');
      return;
    }
    currentFile = file;
    const reader = new FileReader();
    reader.onload = e => {
      const img = new Image();
      img.onload = () => {
        originalImg.src = e.target.result;
        originalInfo.textContent = `${file.name} | ${(file.size/1024).toFixed(1)} KB | ${img.width}×${img.height}`;
        compress(img);
      };
      img.src = e.target.result;
    };
    reader.readAsDataURL(file);
    result.classList.remove('hidden');
  }

  function compress(img) {
    const quality = parseInt(qualitySlider.value) / 100;
    const canvas = document.createElement('canvas');
    canvas.width = img.width;
    canvas.height = img.height;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(img, 0, 0);

    canvas.toBlob(blob => {
      compressedBlob = blob;
      compressedImg.src = URL.createObjectURL(blob);
      const ratio = ((1 - blob.size / currentFile.size) * 100).toFixed(1);
      compressedInfo.textContent = `${(blob.size/1024).toFixed(1)} KB | ${img.width}×${img.height} | 缩小 ${ratio}%`;
    }, currentFile.type, quality);
  }

  uploadZone.addEventListener('click', () => imgInput.click());
  uploadZone.addEventListener('dragover', e => { e.preventDefault(); uploadZone.classList.add('dragover'); });
  uploadZone.addEventListener('dragleave', () => uploadZone.classList.remove('dragover'));
  uploadZone.addEventListener('drop', e => { e.preventDefault(); uploadZone.classList.remove('dragover'); handleFile(e.dataTransfer.files[0]); });
  imgInput.addEventListener('change', () => { if (imgInput.files[0]) handleFile(imgInput.files[0]); });
  qualitySlider.addEventListener('input', () => {
    qualityLabel.textContent = qualitySlider.value;
    if (currentFile) {
      const img = new Image();
      img.onload = () => compress(img);
      img.src = originalImg.src;
    }
  });
  downloadBtn.addEventListener('click', () => {
    if (compressedBlob) {
      const a = document.createElement('a');
      a.href = URL.createObjectURL(compressedBlob);
      const ext = currentFile.name.split('.').pop();
      a.download = `compressed.${ext}`;
      a.click();
    }
  });
})();

/* ===== 2. JSON Formatter ===== */
(function(){
  const input = document.getElementById('jsonInput');
  const output = document.getElementById('jsonOutput');
  const status = document.getElementById('jsonStatus');

  function format() {
    try {
      const parsed = JSON.parse(input.value);
      output.value = JSON.stringify(parsed, null, 2);
      status.textContent = '✅ 格式化成功';
      status.style.color = '#059669';
    } catch(e) {
      status.textContent = '❌ ' + e.message;
      status.style.color = '#dc2626';
    }
  }

  document.getElementById('jsonFormatBtn').addEventListener('click', format);
  document.getElementById('jsonCompactBtn').addEventListener('click', () => {
    try {
      const parsed = JSON.parse(input.value);
      output.value = JSON.stringify(parsed);
      status.textContent = '✅ 压缩成功';
      status.style.color = '#059669';
    } catch(e) {
      status.textContent = '❌ ' + e.message;
      status.style.color = '#dc2626';
    }
  });
  document.getElementById('jsonValidateBtn').addEventListener('click', () => {
    try {
      JSON.parse(input.value);
      status.textContent = '✅ JSON 有效';
      status.style.color = '#059669';
    } catch(e) {
      status.textContent = '❌ ' + e.message;
      status.style.color = '#dc2626';
    }
  });
  document.getElementById('jsonClearBtn').addEventListener('click', () => {
    input.value = ''; output.value = ''; status.textContent = '';
  });
})();

/* ===== 3. Word Counter ===== */
(function(){
  const textarea = document.getElementById('wcInput');
  textarea.addEventListener('input', () => {
    const text = textarea.value;
    document.getElementById('wcChars').textContent = text.length;
    document.getElementById('wcCharsNoSpace').textContent = text.replace(/\s/g, '').length;
    const words = text.trim() ? text.trim().split(/\s+/).length : 0;
    document.getElementById('wcWords').textContent = words;
    const lines = text ? text.split('\n').length : 0;
    document.getElementById('wcLines').textContent = lines;
    const paras = text ? text.split(/\n\s*\n/).filter(p => p.trim()).length : 0;
    document.getElementById('wcParas').textContent = paras;
    const sentences = text ? text.split(/[.!?。！？]+/).filter(s => s.trim()).length : 0;
    document.getElementById('wcSentences').textContent = sentences;
  });
})();

/* ===== 4. Base64 Tool ===== */
(function(){
  const input = document.getElementById('b64Input');
  const output = document.getElementById('b64Output');
  const status = document.getElementById('b64Status');

  document.getElementById('b64EncodeBtn').addEventListener('click', () => {
    try {
      output.value = btoa(unescape(encodeURIComponent(input.value)));
      status.textContent = '✅ 编码成功';
      status.style.color = '#059669';
    } catch(e) {
      status.textContent = '❌ ' + e.message;
      status.style.color = '#dc2626';
    }
  });
  document.getElementById('b64DecodeBtn').addEventListener('click', () => {
    try {
      output.value = decodeURIComponent(escape(atob(input.value)));
      status.textContent = '✅ 解码成功';
      status.style.color = '#059669';
    } catch(e) {
      status.textContent = '❌ 输入不是有效的 Base64';
      status.style.color = '#dc2626';
    }
  });
  document.getElementById('b64CopyBtn').addEventListener('click', () => {
    if (output.value) {
      navigator.clipboard.writeText(output.value);
      status.textContent = '✅ 已复制';
      status.style.color = '#059669';
    }
  });
})();

/* ===== 5. UUID Generator ===== */
(function(){
  const output = document.getElementById('uuidOutput');
  const countInput = document.getElementById('uuidCount');

  function generateUUID() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
      const r = Math.random() * 16 | 0;
      return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16);
    });
  }

  document.getElementById('uuidGenerateBtn').addEventListener('click', () => {
    const count = Math.min(Math.max(parseInt(countInput.value) || 1, 1), 100);
    const uuids = Array.from({length: count}, () => generateUUID());
    output.value = uuids.join('\n');
  });

  document.getElementById('uuidCopyBtn').addEventListener('click', () => {
    if (output.value) navigator.clipboard.writeText(output.value);
  });

  // Generate on load
  document.getElementById('uuidGenerateBtn').click();
})();

/* ===== 6. Color Converter ===== */
(function(){
  const hexInput = document.getElementById('colorHex');
  const rgbInput = document.getElementById('colorRgb');
  const hslInput = document.getElementById('colorHsl');
  const preview = document.getElementById('colorPreview');

  function hexToRgb(hex) {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? { r: parseInt(result[1], 16), g: parseInt(result[2], 16), b: parseInt(result[3], 16) } : null;
  }

  function rgbToHsl(r, g, b) {
    r /= 255; g /= 255; b /= 255;
    const max = Math.max(r, g, b), min = Math.min(r, g, b);
    let h, s, l = (max + min) / 2;
    if (max === min) { h = s = 0 }
    else {
      const d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      switch (max) {
        case r: h = ((g - b) / d + (g < b ? 6 : 0)); break;
        case g: h = ((b - r) / d + 2); break;
        case b: h = ((r - g) / d + 4); break;
      }
      h /= 6;
    }
    return { h: Math.round(h * 360), s: Math.round(s * 100), l: Math.round(l * 100) };
  }

  function updateColors(source) {
    let r, g, b;
    if (source === 'hex') {
      const rgb = hexToRgb(hexInput.value);
      if (!rgb) return;
      r = rgb.r; g = rgb.g; b = rgb.b;
    } else if (source === 'rgb') {
      const match = rgbInput.value.match(/(\d+)/g);
      if (!match || match.length < 3) return;
      r = Math.min(255, Math.max(0, parseInt(match[0])));
      g = Math.min(255, Math.max(0, parseInt(match[1])));
      b = Math.min(255, Math.max(0, parseInt(match[2])));
    } else if (source === 'hsl') {
      const match = hslInput.value.match(/(\d+)/g);
      if (!match || match.length < 3) return;
      let h = parseInt(match[0]) / 360, s = parseInt(match[1]) / 100, l = parseInt(match[2]) / 100;
      if (s === 0) { r = g = b = l * 255 }
      else {
        const hue2rgb = (p, q, t) => {
          if (t < 0) t += 1; if (t > 1) t -= 1;
          if (t < 1/6) return p + (q - p) * 6 * t;
          if (t < 1/2) return q;
          if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
          return p;
        };
        const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
        const p = 2 * l - q;
        r = Math.round(hue2rgb(p, q, h + 1/3) * 255);
        g = Math.round(hue2rgb(p, q, h) * 255);
        b = Math.round(hue2rgb(p, q, h - 1/3) * 255);
      }
    }

    const hex = '#' + [r,g,b].map(x => x.toString(16).padStart(2, '0')).join('');
    const hsl = rgbToHsl(r, g, b);

    hexInput.value = hex;
    rgbInput.value = `rgb(${r},${g},${b})`;
    hslInput.value = `hsl(${hsl.h},${hsl.s}%,${hsl.l}%)`;
    preview.style.background = hex;
  }

  hexInput.addEventListener('input', () => updateColors('hex'));
  rgbInput.addEventListener('input', () => updateColors('rgb'));
  hslInput.addEventListener('input', () => updateColors('hsl'));

  document.getElementById('colorCopyHex').addEventListener('click', () => navigator.clipboard.writeText(hexInput.value));
  document.getElementById('colorCopyRgb').addEventListener('click', () => navigator.clipboard.writeText(rgbInput.value));
  document.getElementById('colorCopyHsl').addEventListener('click', () => navigator.clipboard.writeText(hslInput.value));
})();

/* ===== 7. QR Code Generator ===== */
(function(){
  const input = document.getElementById('qrInput');
  const sizeSelect = document.getElementById('qrSize');
  const generateBtn = document.getElementById('qrGenerateBtn');
  const canvas = document.getElementById('qrCanvas');
  const qrImage = document.getElementById('qrImage');
  const downloadBtn = document.getElementById('qrDownloadBtn');

  let currentQRUrl = null;

  generateBtn.addEventListener('click', () => {
    const text = input.value.trim();
    if (!text) { alert('请输入内容'); return }

    const size = parseInt(sizeSelect.value);
    canvas.width = size;
    canvas.height = size;

    // Generate using QRCode.js
    canvas.innerHTML = '';
    const qr = new QRCode(canvas, {
      text: text,
      width: size,
      height: size,
      colorDark: '#000000',
      colorLight: '#ffffff',
      correctLevel: QRCode.CorrectLevel.H
    });

    // Wait a tick for the QR to render, then capture
    setTimeout(() => {
      const ctx = canvas.getContext('2d');
      if (ctx) {
        currentQRUrl = canvas.toDataURL('image/png');
        qrImage.src = currentQRUrl;
        qrImage.style.width = size + 'px';
        qrImage.style.height = size + 'px';
        qrImage.hidden = false;
        canvas.hidden = true;
        downloadBtn.classList.remove('hidden');
      }
    }, 100);
  });

  downloadBtn.addEventListener('click', e => {
    if (currentQRUrl) {
      const a = document.createElement('a');
      a.href = currentQRUrl;
      a.download = 'qrcode.png';
      a.click();
    }
  });

  // Generate initial QR
  generateBtn.click();
})();
