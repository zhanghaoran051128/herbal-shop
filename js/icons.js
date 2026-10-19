// ============================================================
// Herbal Shop — 手绘 SVG 图标库 v2（中式剪纸剪影风 + 深色细节线）
// 用法：ico("goji") / ICON_SVG["teapot"]
// ============================================================

const ICON_SVG = {
  // ---- 16 味药材 ----
  // 枸杞：挂枝浆果
  goji: `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M13 2c-1 3-2 5-4 6m4-6c1 3 3 5 5 6m-5-6v4" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/><ellipse cx="7" cy="11.5" rx="2.6" ry="3.6" transform="rotate(-14 7 11.5)"/><ellipse cx="15.5" cy="11.5" rx="2.6" ry="3.6" transform="rotate(14 15.5 11.5)"/><ellipse cx="11" cy="17.5" rx="2.6" ry="3.6"/><path d="M6 10.2c.5 1 .5 2.2 0 3.2" stroke="#2a1c0f" stroke-width="0.9" fill="none"/></svg>`,
  // 菊花：八瓣花 + 花心
  chrys: `<svg viewBox="0 0 24 24" fill="currentColor"><ellipse cx="12" cy="5.4" rx="1.7" ry="3.2"/><ellipse cx="12" cy="5.4" rx="1.7" ry="3.2" transform="rotate(45 12 12)"/><ellipse cx="12" cy="5.4" rx="1.7" ry="3.2" transform="rotate(90 12 12)"/><ellipse cx="12" cy="5.4" rx="1.7" ry="3.2" transform="rotate(135 12 12)"/><ellipse cx="12" cy="5.4" rx="1.7" ry="3.2" transform="rotate(180 12 12)"/><ellipse cx="12" cy="5.4" rx="1.7" ry="3.2" transform="rotate(225 12 12)"/><ellipse cx="12" cy="5.4" rx="1.7" ry="3.2" transform="rotate(270 12 12)"/><ellipse cx="12" cy="5.4" rx="1.7" ry="3.2" transform="rotate(315 12 12)"/><circle cx="12" cy="12" r="2.8"/><circle cx="12" cy="12" r="1" fill="#2a1c0f"/></svg>`,
  // 甘草：三根茎条 + 捆绳
  licorice: `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M6.5 2.5h2.2l.9 19H7.4z"/><path d="M10.8 2h2.4l.2 19.5h-2.4z"/><path d="M15.2 2.5h2.2l-.9 19h-2.2z"/><rect x="5.5" y="10.5" width="13" height="3.2" rx="1.2" fill="#2a1c0f"/><path d="M11 12.2h2" stroke="currentColor" stroke-width="1" stroke-linecap="round"/></svg>`,
  // 红枣：椭圆枣 + 叶
  jujube: `<svg viewBox="0 0 24 24" fill="currentColor"><ellipse cx="11.5" cy="13.5" rx="5" ry="6.5"/><path d="M11.5 7c0-2 1-4 3-5" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/><path d="M15 2.5c2.5 0 4.5 1 5.5 3.2-2.4 1-4.6.2-5.5-3.2z"/><path d="M9 10c.8 1.8.8 5 0 7" stroke="#2a1c0f" stroke-width="1" fill="none"/></svg>`,
  // 薄荷：双叶 + 叶脉
  mint: `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M10 21.5C3.8 19.5 1.8 12 3.8 3.5 12 4.5 14.3 12 11.5 20z"/><path d="M13.5 21.5c6-1 9-7 8-14.5-7 1-9.5 7-8 14.5z"/><path d="M6 18c1-4 2.5-8 5-11" stroke="#2a1c0f" stroke-width="1" fill="none"/></svg>`,
  // 生姜：块茎 + 芽指 + 表皮纹
  ginger: `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M2.5 13.5c-.8-2.6 1-4.6 3.4-4.8l2.2-.2c.2-2.4 2-4.2 4.2-4 1.6.2 2.8 1.4 3 3l2.6-.8c2.4-.6 4.2 1 3.8 3.2l-.6 2.6c.4 2.4-1.4 4-3.8 3.6l-3-.6c-.8 2-2.8 3-4.8 2.4-1.6-.4-2.6-1.8-2.6-3.4l-1.8-.8c-1.4-.6-2.2-1.8-1.6-3.2z"/><path d="M7.5 12.5c1 .8 2.2 1 3.4.8M12 8.2c.4 1 1.4 1.6 2.6 1.6M9.5 16.8c1.2.4 2.6.2 3.6-.8" stroke="#2a1c0f" stroke-width="1" fill="none" stroke-linecap="round"/></svg>`,
  // 人参：人形根 + 根须
  ginseng: `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2.5c2 0 3 1.8 3 3.8 0 1.2-.5 2.2-1.2 3l3.2 5.4c1 1.8 1.8 3.6 2 5.8h-3.2c-.2-1.8-1-3.6-2-4.8l-1.8-2.6-1.8 2.6c-1 1.2-1.8 3-2 4.8H5c.2-2.2 1-4 2-5.8l3.2-5.4c-.7-.8-1.2-1.8-1.2-3 0-2 1-3.8 3-3.8z"/><path d="M5.5 19.8c-1 .8-2.2 1.2-3.8 1.2M18.5 19.8c1 .8 2.2 1.2 3.8 1.2M12 2.5c-.4-1-.4-1.8.2-2.4" stroke="currentColor" stroke-width="1.2" fill="none" stroke-linecap="round"/><path d="M12 5.5v3" stroke="#2a1c0f" stroke-width="1" fill="none"/></svg>`,
  // 灵芝：菌盖 + 菌柄 + 环纹
  lingzhi: `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M2 12.5C2 7 6.8 3.5 12 3.5S22 7 22 11c0 1.6-1.2 2.6-3.2 2.6H5.2C3.2 13.6 2 13 2 12.5z"/><path d="M10 14h4l1.2 7.5H8.8z"/><path d="M5 10.5c2-2.5 5-3.5 7-3.5" stroke="#2a1c0f" stroke-width="1.2" fill="none" stroke-linecap="round"/><path d="M6.5 12c1.8-1.8 4-2.4 5.5-2.4" stroke="#2a1c0f" stroke-width="0.9" fill="none" stroke-linecap="round"/></svg>`,
  // 陈皮：三瓣果皮
  peel: `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M11.5 20.5C9.5 15.5 6 13.5 3.5 6.5c5.5-1.2 8.5 3.2 8.5 8.5z"/><path d="M12.5 20.5c2-5 5.5-7 8-14-5.5-1.2-8.5 3.2-8.5 8.5z"/><path d="M12 20.5c-.8-4.5-.8-9 0-13.5 2.8 4 2.8 9 0 13.5z"/><circle cx="8" cy="11" r="0.8" fill="#2a1c0f"/><circle cx="16" cy="11" r="0.8" fill="#2a1c0f"/><circle cx="12" cy="14" r="0.8" fill="#2a1c0f"/></svg>`,
  // 金银花：双花 + 伸出的花蕊
  honey: `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M9 21.5C6 17.5 5 12.5 7 7.5c3 1 5 4 5 8-1 3-2 5-3 6z"/><path d="M15 21.5c3-4 4-9 2-14-3 1-5 4-5 8 1 3 2 5 3 6z"/><path d="M9 8.5L7 3.5M11 9.5l-1-5.5M15 8.5l2-5M13 9.5l1-5.5" stroke="currentColor" stroke-width="1.2" fill="none" stroke-linecap="round"/><circle cx="7" cy="3" r="1.3"/><circle cx="10" cy="3.6" r="1.3"/><circle cx="17" cy="3" r="1.3"/><circle cx="14" cy="3.6" r="1.3"/></svg>`,
  // 桂圆：果串 + 叶 + 龙眼核
  longan: `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M11 6.5c0-2 1-3.5 2.5-4.5" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/><path d="M13.8 2c2.4 0 4.4 1 5.4 3-2.3 1.2-4.5.2-5.4-3z"/><circle cx="8.8" cy="10.5" r="4.2"/><circle cx="15.6" cy="12.5" r="4.2"/><circle cx="11.5" cy="17.2" r="4.2"/><circle cx="8.8" cy="10.5" r="1.3" fill="#2a1c0f"/></svg>`,
  // 罗汉果：圆果 + 条纹 + 果脐
  monk: `<svg viewBox="0 0 24 24" fill="currentColor"><circle cx="12" cy="13" r="8"/><path d="M8.8 5.8c-2 4.8-2 9.6 0 14.4M15.2 5.8c2 4.8 2 9.6 0 14.4" stroke="#2a1c0f" stroke-width="1.2" fill="none"/><path d="M12 5c0-1.6 1-2.6 2.2-3.2" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"/><path d="M10.2 20.6l1.8 1.4 1.8-1.4-1.8-.8z" fill="#2a1c0f"/></svg>`,
  // 薏米：麦穗
  coix: `<svg viewBox="0 0 24 24" fill="currentColor"><ellipse cx="8.6" cy="6" rx="1.9" ry="3" transform="rotate(-28 8.6 6)"/><ellipse cx="15.4" cy="6" rx="1.9" ry="3" transform="rotate(28 15.4 6)"/><ellipse cx="8.6" cy="11.5" rx="1.9" ry="3" transform="rotate(-28 8.6 11.5)"/><ellipse cx="15.4" cy="11.5" rx="1.9" ry="3" transform="rotate(28 15.4 11.5)"/><ellipse cx="12" cy="3.4" rx="1.9" ry="3"/><path d="M12 13v9" stroke="currentColor" stroke-width="1.8" fill="none" stroke-linecap="round"/><path d="M8.6 6l.8 1.5M15.4 6l-.8 1.5M8.6 11.5l.8 1.5M15.4 11.5l-.8 1.5" stroke="#2a1c0f" stroke-width="0.8" fill="none"/></svg>`,
  // 黄芪：圆切片 + 年轮纹
  astrag: `<svg viewBox="0 0 24 24" fill="currentColor"><circle cx="9" cy="8" r="5"/><circle cx="15" cy="12.5" r="5"/><circle cx="9.5" cy="17" r="5"/><circle cx="9" cy="8" r="2.8" stroke="#2a1c0f" stroke-width="1" fill="none"/><circle cx="15" cy="12.5" r="2.8" stroke="#2a1c0f" stroke-width="1" fill="none"/><circle cx="9.5" cy="17" r="2.8" stroke="#2a1c0f" stroke-width="1" fill="none"/></svg>`,
  // 当归：伞形花序
  angelica: `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 22V9.5" stroke="currentColor" stroke-width="1.8" fill="none" stroke-linecap="round"/><path d="M12 9.5C8.5 8 6.5 6 6 3.5M12 9.5c3.5-1.5 5.5-3.5 6-6M12 9.5V3.5" stroke="currentColor" stroke-width="1.5" fill="none" stroke-linecap="round"/><circle cx="6" cy="3" r="1.8"/><circle cx="12" cy="2.8" r="1.8"/><circle cx="18" cy="3" r="1.8"/><circle cx="9" cy="4.8" r="1.4"/><circle cx="15" cy="4.8" r="1.4"/><path d="M12 14c-2-1-3.5-2.5-4-4.5M12 17c2-1 3.5-2.5 4-4.5" stroke="currentColor" stroke-width="1.2" fill="none" stroke-linecap="round"/></svg>`,
  // 虫草：分节虫体 + 草芽 + 眼点
  cordy: `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M2.5 17c0-3 2.5-5 6-5h7c2.8 0 5 1.5 5 4s-2.2 4-5 4h-8c-3 0-5-1.2-5-3z"/><path d="M7 12.3v7.4M11 12v8M15 12.2v7.6" stroke="#2a1c0f" stroke-width="1.1"/><path d="M18.5 12c-.3-4.5.8-8 3-10 1.4 3.5.3 7.5-3 10z"/><circle cx="5.5" cy="16" r="1" fill="#2a1c0f"/></svg>`,
  // ---- 器具 ----
  tank: `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M5 3.5h14V7c1 1 1.4 2 1.4 3.2v3.6c0 1.2-.4 2.2-1.4 3.2v3.5H5V17c-1-1-1.4-2-1.4-3.2v-3.6C3.6 9 4 8 5 7z"/><path d="M4.5 7.2h15M4.5 16.8h15" stroke="#2a1c0f" stroke-width="1.3"/><path d="M10 10.5h4M10 13.5h4" stroke="#2a1c0f" stroke-width="1"/></svg>`,
  teapot: `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M8.5 7.5h7l-1-2.2h-5z"/><circle cx="12" cy="4.2" r="1.3"/><path d="M5.2 11.5a6.8 6.8 0 0 0 13.6 0V11a6.8 6.8 0 0 0-13.6 0z"/><path d="M18.8 11.8l3-3.2c1.2 1.2 1.2 3.2-.2 4.4l-2.8.8z"/><path d="M5.2 11.5c-1.5-.5-2.5-1.5-3-3 1.5-.8 3-.5 4 .8z"/><path d="M9 12.5c1 1.5 2 2.2 3 2.2" stroke="#2a1c0f" stroke-width="1" fill="none" stroke-linecap="round"/></svg>`,
  stove: `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2.5c.8 3.2-2.4 4.4-2.4 7.4 0 1.8 1.4 3.4 2.4 3.4-.4-1.2-.2-2.4 1-3.4 1.2 1 2.8 2.4 2.8 4.6 0 2.6-2 4.5-3.8 4.5s-4.6-2-4.6-5c0-4.2 4-6.2 4.6-11.5z"/><path d="M3.5 21.5l17-2M5 23.5l14-2" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>`,
  cup: `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M3.5 10h13v4.2a5 5 0 0 1-5 5h-3a5 5 0 0 1-5-5z"/><path d="M16.5 11h2.4a2.2 2.2 0 0 1 0 4.4h-2.4" fill="none" stroke="currentColor" stroke-width="1.6"/><path d="M8 7.2c0-1.6 1.6-1.6 1.6-3.2M12.5 7.2c0-1.6 1.6-1.6 1.6-3.2" stroke="currentColor" stroke-width="1.4" fill="none" stroke-linecap="round"/></svg>`,
};

// 渲染辅助：有 SVG 用 SVG，没有则回退 emoji
function iconOf(id, emojiFallback, cls = "") {
  return ICON_SVG[id]
    ? `<span class="svg-ico ${cls}">${ICON_SVG[id]}</span>`
    : `<span class="${cls}">${emojiFallback || ""}</span>`;
}
