const INITIAL_VISIBLE_RESULT_COUNT = 240;
const RESULT_LOAD_MORE_STEP = 240;
const WISHLIST_STORAGE_KEY = "ffxivGearWishlist.v1";
const FAVORITE_STORAGE_KEY = "ffxivGearFavorites.v1";
const APP_SETTINGS_STORAGE_KEY = "ffxivGearAppSettings.v1";
const IMAGE_GENDER_PREFERENCE_STORAGE_KEY = "ffxivGearImageGenderPreference.v1";
const RACE_PREVIEW_STORAGE_KEY = "ffxivGearRacePreview.v1";
const IMAGE_GENDER_PREFERENCES = ["none", "male", "female"];
const RACE_PREVIEW_OPTIONS = ["midlander", "highlander", "elezen", "lalafell", "miqote", "roegadyn", "aura", "viera", "hrothgar"];
const RECOMMENDATION_MODES = ["ask", "auto", "off"];
const DEFAULT_APP_SETTINGS = {
  recommendationMode: "ask",
  cleanupReplacedItems: false,
};
const RANDOM_BOX_DROP_TEXT = "开箱随机掉落";
const LEGACY_DIRECT_DROP_TEXT = ["直接", "掉落"].join("");

const ARMOR_SLOTS = ["头部", "身体", "手部", "腿部", "脚部"];
const ACCESSORY_SLOTS = ["耳饰", "项链", "手镯", "戒指"];
const ACCESSORY_SLOT_GROUP_PREFIX = {
  "耳饰": "Earrings",
  "项链": "Necklace",
  "手镯": "Bracelets",
  "戒指": "Ring",
};
const MANUAL_ACCESSORY_GROUP_MERGES = [
  ["group0031", "group0032", "group0033", "group0034"],
];
const GEAR_SET_CATEGORY_OPTIONS = [
  { value: "all", label: "全部套装类别" },
  { value: "combatArmor", label: "战斗职业套装" },
  { value: "craftGatherArmor", label: "生产采集套装" },
  { value: "combatAccessory", label: "战斗职业饰品套装" },
  { value: "craftGatherAccessory", label: "生产采集饰品套装" },
  { value: "other", label: "其他套装" },
];
const GEAR_SET_DYE_IMAGE_DIRS = {
  original: "original",
  dye1: "dye1",
  dye2: "dye2",
  dyeDouble: "dye-double",
};
const GEAR_SET_IMAGE_EXTENSIONS = ["jpg", "png", "webp"];
const ALL_EQUIP_SLOT_OPTIONS = [
  { value: "all", label: "全部装备栏部位" },
  ...ARMOR_SLOTS.map((slot) => ({ value: slot, label: slot })),
  ...ACCESSORY_SLOTS.map((slot) => ({ value: slot, label: slot })),
];
const ARMOR_EQUIP_SLOT_OPTIONS = [
  { value: "all", label: "全部防具栏位" },
  ...ARMOR_SLOTS.map((slot) => ({ value: slot, label: slot })),
];
const ACCESSORY_EQUIP_SLOT_OPTIONS = [
  { value: "all", label: "全部饰品栏位" },
  ...ACCESSORY_SLOTS.map((slot) => ({ value: slot, label: slot })),
];
const WISHLIST_SOURCE_GROUP_ORDER = [
  "商城",
  "制作",
  "NPC购买",
  "点数/货币兑换",
  "战斗内容",
  "PVP",
  "任务/成就",
  "活动",
  "其他",
  "获取方式未记录",
];
const BROWSE_ENGINES = ["gearPieces", "accessoryPieces", "gearSets", "gearSeries", "weaponPieces", "weaponSeries"];
const COLLECTION_ENGINES = ["wishlist", "favorites"];
const ENGINE_LABELS = {
  gearPieces: "防具散件",
  accessoryPieces: "饰品散件",
  gearSets: "装备套装",
  customGearSets: "自定义套装",
  gearSeries: "装备系列",
  weaponPieces: "武器散件",
  weaponSeries: "武器系列",
  wishlist: "愿望单",
  favorites: "我的收藏",
};

const dom = {
  appShell: document.querySelector(".app-shell"),
  engineTabs: Array.from(document.querySelectorAll(".engine-tab")),
  topActionButtons: Array.from(document.querySelectorAll(".top-action-button[data-engine]")),
  resultList: document.getElementById("resultList"),
  detailTop: document.querySelector(".detail-top"),
  acquisitionRegion: document.querySelector(".acquisition-region"),
  gearSetsDetailView: document.getElementById("gearSetsDetailView"),
  filterToggle: document.getElementById("filterToggle"),
  filterDropdown: document.getElementById("filterDropdown"),
  accessoryViewToggle: document.getElementById("accessoryViewToggle"),
  accessoryModeButtons: Array.from(document.querySelectorAll("[data-accessory-view-mode]")),
  wishlistToolbar: document.getElementById("wishlistToolbar"),
  wishlistToolbarSummary: document.getElementById("wishlistToolbarSummary"),
  wishlistViewToggle: document.getElementById("wishlistViewToggle"),
  wishlistModeButtons: Array.from(document.querySelectorAll("[data-wishlist-view-mode]")),
  wishlistInstanceStatsButton: document.getElementById("wishlistInstanceStatsButton"),
  wishlistRoutePlanButton: document.getElementById("wishlistRoutePlanButton"),
  searchInput: document.getElementById("searchInput"),
  equipSlotFilter: document.getElementById("equipSlotFilter"),
  armorAccessoryFilterGroup: document.getElementById("armorAccessoryFilterGroup"),
  dyeCrestFilterGroup: document.getElementById("dyeCrestFilterGroup"),
  armorOnly: document.getElementById("armorOnly"),
  accessoryOnly: document.getElementById("accessoryOnly"),
  recommendedOnly: document.getElementById("recommendedOnly"),
  minItemLevelInput: document.getElementById("minItemLevelInput"),
  maxItemLevelInput: document.getElementById("maxItemLevelInput"),
  minEquipLevelInput: document.getElementById("minEquipLevelInput"),
  maxEquipLevelInput: document.getElementById("maxEquipLevelInput"),
  sourceFilter: document.getElementById("sourceFilter"),
  sourceGroupFilter: document.getElementById("sourceGroupFilter"),
  dresserFilterLabel: document.getElementById("dresserFilterLabel"),
  dresserSetOnly: document.getElementById("dresserSetOnly"),
  dresserSetOffOnly: document.getElementById("dresserSetOffOnly"),
  armoireOnly: document.getElementById("armoireOnly"),
  armoireOffOnly: document.getElementById("armoireOffOnly"),
  sameModelOnly: document.getElementById("sameModelOnly"),
  sameModelOffOnly: document.getElementById("sameModelOffOnly"),
  marketOnly: document.getElementById("marketOnly"),
  dualDyeOnly: document.getElementById("dualDyeOnly"),
  dyeOnly: document.getElementById("dyeOnly"),
  noDyeOnly: document.getElementById("noDyeOnly"),
  crestOnly: document.getElementById("crestOnly"),
  sortFilter: document.getElementById("sortFilter"),
  previewImage: document.getElementById("piecePreviewImage"),
  previewTitle: document.getElementById("previewTitle"),
  detailItemIcon: document.getElementById("detailItemIcon"),
  basicInfoGrid: document.getElementById("basicInfoGrid"),
  detailTagRow: document.getElementById("detailTagRow"),
  setPanelTitle: document.getElementById("setPanelTitle"),
  setPanelList: document.getElementById("setPanelList"),
  setRelationRegion: document.getElementById("setRelationRegion"),
  racePreviewPanel: document.getElementById("racePreviewPanel"),
  racePreviewButtons: Array.from(document.querySelectorAll("[data-preview-race]")),
  sameModelTableBody: document.getElementById("sameModelTableBody"),
  acquisitionTableBody: document.getElementById("acquisitionTableBody"),
  currentFilters: document.querySelector(".current-filters"),
  appNoticeButton: document.getElementById("appNoticeButton"),
  appHelpButton: document.getElementById("appHelpButton"),
  appSettingsButton: document.getElementById("appSettingsButton"),
  genderTabs: Array.from(document.querySelectorAll("[data-gender]")),
  dyeTabs: Array.from(document.querySelectorAll("[data-dye]")),
};

const state = {
  currentEngine: "gearPieces",
  allGearPieces: [],
  allArmorPieces: [],
  allAccessoryPieces: [],
  allAccessoryGroupItems: [],
  allWeaponPieces: [],
  allItems: [],
  sameModelOnlyItems: [],
  sameModelOnlyItemsById: new Map(),
  gearPiecesById: new Map(),
  weaponPiecesById: new Map(),
  officialGearSets: [],
  customGearSets: [],
  allGearSets: [],
  allGearSeries: [],
  allWeaponSeries: [],
  allSeries: [],
  filteredItems: [],
  filteredGearSets: [],
  filteredSeries: [],
  visibleItemCount: INITIAL_VISIBLE_RESULT_COUNT,
  selectedItemId: null,
  previewItemId: null,
  selectedGearSet: null,
  selectedSeries: null,
  previewGearSetKey: null,
  previewGearSetPieceId: null,
  wishlistIds: new Set(),
  favoriteIds: new Set(),
  wishlistViewMode: "list",
  accessoryViewMode: "group",
  selectedWishlistKey: "",
  gilShopRouteIndex: null,
  teleportCostIndex: null,
  instanceTokenSourceMap: null,
  tokenInstanceLookup: null,
  selectedStartAetheryteId: "",
  purchaseRoutePlan: null,
  routeMenuHideTimer: 0,
  appSettings: { ...DEFAULT_APP_SETTINGS },
  gender: "male",
  manualGender: "male",
  imageGenderPreference: "none",
  previewRace: "midlander",
  dye: "original",
  sourceTaxonomy: null,
  imageViewerZoom: 1,
  imageViewerPanX: 0,
  imageViewerPanY: 0,
  imageViewerDragging: null,
};

function escapeHtml(value) {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function normalizeListData(data) {
  if (Array.isArray(data)) return data;
  if (!data?.schema || !Array.isArray(data.rows)) return [];
  const instanceNamesById = data.instanceNamesById || {};
  return data.rows.map((row) => {
    const item = Object.fromEntries(data.schema.map((field, index) => [field, row[index]]));
    const instanceNames = instanceNamesById[String(item.id)];
    if (Array.isArray(instanceNames) && instanceNames.length) item.instanceNames = instanceNames;
    return item;
  });
}

function flagToBool(value) {
  if (typeof value === "boolean") return value;
  if (value === null || value === undefined || value === "") return false;
  if (typeof value === "number") return value !== 0;
  if (typeof value === "string") return value !== "0" && value.toLowerCase() !== "false";
  return Boolean(value);
}

function adaptPiece(item) {
  return {
    ...item,
    itemLevel: Number(item.ilvl ?? 0),
    equipLevel: Number(item.elvl ?? 0),
    canDye: Number(item.dyecount || 0) > 0,
    canDualDye: Number(item.dyecount || 0) >= 2,
    canDresser: flagToBool(item.glamourous),
    canDresserSet: flagToBool(item.canDresserSet),
    canArmoire: flagToBool(item.storable),
    canCrest: flagToBool(item.crestworthy),
    canSellOnMarket: flagToBool(item.tradeable),
    isUnique: flagToBool(item.unique),
    hasSameModel: Array.isArray(item.sharedModels) && item.sharedModels.length > 0,
  };
}

function isVisibleItem(item) {
  return !item?.isBanned;
}

function buildAccessoryGroupIds(items) {
  const accessoryIds = new Set(items.map((item) => Number(item.id)).filter(Number.isFinite));
  const parent = new Map(Array.from(accessoryIds, (id) => [id, id]));
  const find = (id) => {
    let current = id;
    while (parent.get(current) !== current) {
      parent.set(current, parent.get(parent.get(current)));
      current = parent.get(current);
    }
    return current;
  };
  const union = (left, right) => {
    const leftRoot = find(left);
    const rightRoot = find(right);
    if (leftRoot !== rightRoot) parent.set(Math.max(leftRoot, rightRoot), Math.min(leftRoot, rightRoot));
  };

  items.forEach((item) => {
    const itemId = Number(item.id);
    if (!accessoryIds.has(itemId)) return;
    (Array.isArray(item.sharedModels) ? item.sharedModels : []).forEach((sharedId) => {
      const numericSharedId = Number(sharedId);
      if (accessoryIds.has(numericSharedId)) union(itemId, numericSharedId);
    });
  });

  const groups = new Map();
  Array.from(accessoryIds).sort((a, b) => a - b).forEach((itemId) => {
    const root = find(itemId);
    if (!groups.has(root)) groups.set(root, []);
    groups.get(root).push(itemId);
  });

  const preliminary = new Map();
  Array.from(groups.keys()).sort((a, b) => a - b).forEach((root, index) => {
    const groupId = `group${String(index + 1).padStart(4, "0")}`;
    groups.get(root).forEach((itemId) => preliminary.set(itemId, groupId));
  });

  MANUAL_ACCESSORY_GROUP_MERGES.forEach((mergeGroup) => {
    const [target, ...aliases] = mergeGroup;
    const aliasSet = new Set([target, ...aliases]);
    preliminary.forEach((groupId, itemId) => {
      if (aliasSet.has(groupId)) preliminary.set(itemId, target);
    });
  });

  const itemsById = new Map(items.map((item) => [Number(item.id), item]));
  const groupMembers = new Map();
  preliminary.forEach((groupId, itemId) => {
    if (!groupMembers.has(groupId)) groupMembers.set(groupId, []);
    groupMembers.get(groupId).push(itemId);
  });

  const groupRenames = new Map();
  Object.entries(ACCESSORY_SLOT_GROUP_PREFIX).forEach(([slot, prefix]) => {
    const slotGroups = Array.from(groupMembers.entries())
      .filter(([, itemIds]) => itemsById.get(Math.min(...itemIds))?.equipSlot === slot)
      .map(([groupId, itemIds]) => [Math.min(...itemIds), groupId])
      .sort((a, b) => a[0] - b[0]);
    slotGroups.forEach(([, groupId], index) => {
      groupRenames.set(groupId, `${prefix}-${String(index + 1).padStart(3, "0")}`);
    });
  });

  const result = new Map();
  preliminary.forEach((groupId, itemId) => {
    result.set(itemId, groupRenames.get(groupId) || groupId);
  });
  return result;
}

function attachAccessoryGroupIds(items) {
  if (items.every((item) => item.accessorygroupId)) return items;
  const accessoryGroupIds = buildAccessoryGroupIds(items);
  return items.map((item) => ({
    ...item,
    accessorygroupId: item.accessorygroupId || accessoryGroupIds.get(Number(item.id)) || "",
  }));
}

function loadJson(path) {
  return fetch(path, { cache: "no-store" }).then((response) => {
    if (!response.ok) throw new Error(`${path} ${response.status}`);
    return response.json();
  });
}

function getStorageJson(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

function setStorageJson(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // Browser storage may be disabled.
  }
}

function normalizeRecommendationMode(value) {
  return RECOMMENDATION_MODES.includes(value) ? value : DEFAULT_APP_SETTINGS.recommendationMode;
}

function normalizeAppSettings(value) {
  const source = value && typeof value === "object" ? value : {};
  return {
    recommendationMode: normalizeRecommendationMode(source.recommendationMode),
    cleanupReplacedItems: Boolean(source.cleanupReplacedItems),
  };
}

function syncAppSettings() {
  state.appSettings = normalizeAppSettings(getStorageJson(APP_SETTINGS_STORAGE_KEY, DEFAULT_APP_SETTINGS));
}

function persistAppSettings(patch) {
  state.appSettings = normalizeAppSettings({ ...state.appSettings, ...patch });
  setStorageJson(APP_SETTINGS_STORAGE_KEY, state.appSettings);
}

function getWishlistData() {
  const data = getStorageJson(WISHLIST_STORAGE_KEY, { version: 1, items: [] });
  return Array.isArray(data.items) ? data : { version: 1, items: [] };
}

function setWishlistData(data) {
  setStorageJson(WISHLIST_STORAGE_KEY, data);
  syncWishlistIds();
}

function getEntryKey(engine, id) {
  return `${engine}:${String(id)}`;
}

function parseEntryKey(key) {
  const text = String(key || "");
  const index = text.indexOf(":");
  if (index === -1) return { engine: state.currentEngine === "weaponPieces" ? "weaponPieces" : "gearPieces", id: text };
  return { engine: text.slice(0, index), id: text.slice(index + 1) };
}

function syncWishlistIds() {
  state.wishlistIds = new Set(getWishlistData().items.map((item) => getEntryKey(item.engine, item.id)));
}

function syncFavoriteIds() {
  const data = getStorageJson(FAVORITE_STORAGE_KEY, []);
  state.favoriteIds = new Set(Array.isArray(data) ? data.map(String) : []);
}

function normalizeImageGenderPreference(value) {
  return IMAGE_GENDER_PREFERENCES.includes(value) ? value : "none";
}

function syncImageGenderPreference() {
  state.imageGenderPreference = normalizeImageGenderPreference(getStorageJson(IMAGE_GENDER_PREFERENCE_STORAGE_KEY, "none"));
}

function persistImageGenderPreference(value) {
  state.imageGenderPreference = normalizeImageGenderPreference(value);
  setStorageJson(IMAGE_GENDER_PREFERENCE_STORAGE_KEY, state.imageGenderPreference);
}

function normalizePreviewRace(value) {
  return RACE_PREVIEW_OPTIONS.includes(value) ? value : "midlander";
}

function syncPreviewRace() {
  state.previewRace = normalizePreviewRace(getStorageJson(RACE_PREVIEW_STORAGE_KEY, "midlander"));
}

function persistPreviewRace(value) {
  state.previewRace = normalizePreviewRace(value);
  setStorageJson(RACE_PREVIEW_STORAGE_KEY, state.previewRace);
}

function toggleFavorite(key) {
  const keys = getCollectionItemKeysFromKey(key);
  if (!keys.length) return;
  const allActive = keys.every((itemKey) => state.favoriteIds.has(itemKey));
  keys.forEach((itemKey) => {
    if (allActive) state.favoriteIds.delete(itemKey);
    else state.favoriteIds.add(itemKey);
  });
  setStorageJson(FAVORITE_STORAGE_KEY, Array.from(state.favoriteIds));
}

function toggleWishlist(key) {
  const keys = getCollectionItemKeysFromKey(key);
  if (!keys.length) return;
  const data = getWishlistData();
  const allActive = keys.every((entryKey) => state.wishlistIds.has(entryKey));
  if (allActive) {
    data.items = data.items.filter((item) => !keys.includes(getEntryKey(item.engine, item.id)));
  } else {
    const existing = new Set(data.items.map((item) => getEntryKey(item.engine, item.id)));
    keys.forEach((entryKey) => {
      if (existing.has(entryKey)) return;
      const { engine, id } = parseEntryKey(entryKey);
      data.items.push({
        engine,
        id: String(id),
        addedAt: new Date().toISOString(),
        priority: "normal",
        status: "wanted",
        note: "",
        tags: [],
      });
    });
  }
  setWishlistData(data);
}

function updateWishlistEntry(engine, id, patch) {
  const key = getEntryKey(engine, id);
  const data = getWishlistData();
  const entry = data.items.find((item) => getEntryKey(item.engine, item.id) === key);
  if (entry) Object.assign(entry, patch);
  setWishlistData(data);
}

function removeWishlistEntry(engine, id) {
  const key = getEntryKey(engine, id);
  const data = getWishlistData();
  data.items = data.items.filter((item) => getEntryKey(item.engine, item.id) !== key);
  setWishlistData(data);
}

function addWishlistEntryIfMissing(engine, id, status = "wanted") {
  const data = getWishlistData();
  const key = getEntryKey(engine, id);
  if (!data.items.some((item) => getEntryKey(item.engine, item.id) === key)) {
    data.items.push({
      engine,
      id: String(id),
      addedAt: new Date().toISOString(),
      priority: "normal",
      status,
      note: "",
      tags: [],
    });
  }
  setWishlistData(data);
}

function getItemEngine(item) {
  if (item?.type === "武器散件") return "weaponPieces";
  if (item?.slotCategory === "饰品") return "accessoryPieces";
  return "gearPieces";
}

function getItemKey(item) {
  return getEntryKey(getItemEngine(item), item?.id);
}

function getCollectionItemKeysForItem(item) {
  return item?.id ? [getItemKey(item)] : [];
}

function getCollectionItemKeysForGearSet(setEntity) {
  return getGearSetPieces(setEntity).flatMap(getCollectionItemKeysForItem);
}

function getCollectionItemKeysForSeries(seriesEntity) {
  return getSeriesPieces(seriesEntity).flatMap(getCollectionItemKeysForItem);
}

function uniqueKeys(keys) {
  return Array.from(new Set(keys.map(String).filter(Boolean)));
}

function getCollectionItemKeysFromKey(key) {
  const { engine, id } = parseEntryKey(key);
  if (engine === "gearPieces" || engine === "accessoryPieces" || engine === "weaponPieces") {
    const item = engine === "weaponPieces" ? state.weaponPiecesById.get(String(id)) : state.gearPiecesById.get(String(id));
    return uniqueKeys(getCollectionItemKeysForItem(item || { id, type: engine === "weaponPieces" ? "武器散件" : "", slotCategory: engine === "accessoryPieces" ? "饰品" : "防具" }));
  }
  if (engine === "gearSets" || engine === "customGearSets") return uniqueKeys(getCollectionItemKeysForGearSet(getGearSetByKey(getEntryKey(engine, id))));
  if (engine === "gearSeries" || engine === "weaponSeries") return uniqueKeys(getCollectionItemKeysForSeries(getSeriesByKey(getEntryKey(engine, id))));
  return [];
}

function collectionHasAll(collection, key) {
  const keys = getCollectionItemKeysFromKey(key);
  return keys.length > 0 && keys.every((itemKey) => collection.has(itemKey));
}

function isWeaponEngine(engine = state.currentEngine) {
  return engine === "weaponPieces";
}

function isPieceEngine(engine = state.currentEngine) {
  return engine === "gearPieces" || engine === "accessoryPieces" || engine === "weaponPieces";
}

function isSeriesEngine(engine = state.currentEngine) {
  return engine === "gearSeries" || engine === "weaponSeries";
}

function isCollectionEngine(engine = state.currentEngine) {
  return COLLECTION_ENGINES.includes(engine);
}

function getPieceLabel(engine = state.currentEngine) {
  if (isWeaponEngine(engine)) return "武器散件";
  if (engine === "accessoryPieces") return "饰品散件";
  return "防具散件";
}

function isAccessoryGroupView() {
  return state.currentEngine === "accessoryPieces" && state.accessoryViewMode === "group";
}

function syncAccessoryViewModeChrome() {
  dom.appShell?.setAttribute("data-accessory-view-mode", state.currentEngine === "accessoryPieces" ? state.accessoryViewMode : "");
  dom.accessoryModeButtons.forEach((button) => button.classList.toggle("is-active", button.dataset.accessoryViewMode === state.accessoryViewMode));
}

function getItemById(id) {
  return state.allItems.find((item) => String(item.id) === String(id)) || getPieceById(id) || state.sameModelOnlyItemsById.get(String(id)) || null;
}

function getPieceById(id) {
  return state.gearPiecesById.get(String(id)) || state.weaponPiecesById.get(String(id)) || null;
}

function getGearPieceById(id) {
  return state.gearPiecesById.get(String(id)) || null;
}

function getIconUrl(item) {
  if (!item) return "";
  const fallback = getItemIconFallbackUrl(item);
  const iconPath = typeof item.iconPath === "string" ? item.iconPath.trim() : item.iconPath;
  if (typeof iconPath === "string" && iconPath.startsWith("t/")) return fallback;
  if (Number.isFinite(Number(iconPath))) {
    const iconId = Number(iconPath);
    const folder = String(Math.floor(iconId / 1000) * 1000).padStart(6, "0");
    const file = String(iconId).padStart(6, "0");
    return `images/icons/raw/${folder}/${file}_hr1.png`;
  }
  if (typeof iconPath === "string" && iconPath) return iconPath;
  return fallback;
}

function getItemIconFallbackUrl(item) {
  return item?.id ? `images/icons/items/item-${item.id}.png` : "";
}

function renderIconImageAttrs(item, className = "") {
  const fallback = getItemIconFallbackUrl(item);
  const attrs = [
    className ? `class="${escapeHtml(className)}"` : "",
    `src="${escapeHtml(getIconUrl(item))}"`,
    fallback ? `data-icon-fallback="${escapeHtml(fallback)}"` : "",
    `alt=""`,
  ];
  return attrs.filter(Boolean).join(" ");
}

function handleIconImageError(image) {
  const fallback = image?.dataset?.iconFallback;
  if (!fallback || image.dataset.iconFallbackTried === "true" || image.src.endsWith(fallback)) return;
  image.dataset.iconFallbackTried = "true";
  image.src = fallback;
}

function handlePreviewImageError(image) {
  const fallbacks = String(image?.dataset?.previewFallbacks || "")
    .split("|")
    .map((path) => path.trim())
    .filter(Boolean);
  const [next, ...rest] = fallbacks;
  if (next) {
    image.dataset.previewFallbacks = rest.join("|");
    image.src = next;
    return true;
  }
  if (image?.classList?.contains("gear-sets-preview-image")) {
    image.replaceWith(Object.assign(document.createElement("div"), { className: "gear-sets-preview-empty" }));
    return true;
  }
  return false;
}

function renderPreviewImageAttrs(paths, className, altText) {
  const candidates = uniqueList(paths.filter(Boolean));
  const [src, ...fallbacks] = candidates;
  if (!src) return "";
  return [
    className ? `class="${escapeHtml(className)}"` : "",
    `src="${escapeHtml(src)}"`,
    fallbacks.length ? `data-preview-fallbacks="${escapeHtml(fallbacks.join("|"))}"` : "",
    `alt="${escapeHtml(altText)}"`,
  ].filter(Boolean).join(" ");
}

function getPreviewImages(item) {
  return item?.previewImages || {};
}

function getRacePreviewImages(item) {
  return item?.racePreviewImages && typeof item.racePreviewImages === "object" ? item.racePreviewImages : null;
}

function syncRacePreviewPanel(item) {
  const racePreviewImages = getRacePreviewImages(item);
  const visible = Boolean(racePreviewImages);
  if (dom.racePreviewPanel) dom.racePreviewPanel.hidden = !visible;
  dom.setRelationRegion?.classList.toggle("has-race-preview", visible);
  dom.racePreviewButtons.forEach((button) => {
    button.classList.toggle("is-active", visible && button.dataset.previewRace === state.previewRace);
    button.setAttribute("aria-pressed", visible && button.dataset.previewRace === state.previewRace ? "true" : "false");
  });
}

function getAvailablePreviewGenders(item) {
  const previewImages = getPreviewImages(item);
  const genders = new Set();
  Object.values(previewImages).forEach((entry) => {
    if (!entry || typeof entry !== "object") return;
    if (entry.male) genders.add("male");
    if (entry.female) genders.add("female");
  });
  if (item?.genderRestriction === "male") return ["male"];
  if (item?.genderRestriction === "female") return ["female"];
  return ["male", "female"].filter((gender) => genders.has(gender));
}

function ensurePreviewGender(item) {
  const genders = getAvailablePreviewGenders(item);
  if (genders.length && !genders.includes(state.gender)) state.gender = genders[0];
}

function applyImageGenderPreferenceForGenders(genders) {
  if (!genders.length) return;
  if (genders.length === 1) {
    state.gender = genders[0];
    return;
  }
  const preference = normalizeImageGenderPreference(state.imageGenderPreference);
  if (preference !== "none" && genders.includes(preference)) {
    state.gender = preference;
    return;
  }
  if (genders.includes(state.manualGender)) {
    state.gender = state.manualGender;
    return;
  }
  if (!genders.includes(state.gender)) state.gender = genders[0];
}

function applyImageGenderPreferenceForItem(item) {
  const genders = getAvailablePreviewGenders(item);
  applyImageGenderPreferenceForGenders(genders);
}

function applyImageGenderPreferenceForCurrentItem() {
  applyImageGenderPreferenceForItem(getItemById(state.previewItemId) || getItemById(state.selectedItemId));
}

function getCurrentPreviewGenders() {
  if (state.currentEngine === "gearSets" && state.selectedGearSet) {
    const previewSet = state.previewGearSetKey ? getGearSetByKey(state.previewGearSetKey) || state.selectedGearSet : state.selectedGearSet;
    return getAvailableGearSetPreviewGenders(previewSet);
  }
  return getAvailablePreviewGenders(getItemById(state.previewItemId) || getItemById(state.selectedItemId));
}

function setSelectedItemId(id) {
  state.selectedItemId = id == null ? null : Number(id);
  state.previewItemId = state.selectedItemId;
  applyImageGenderPreferenceForCurrentItem();
}

function setPreviewItemId(id) {
  state.previewItemId = id == null ? null : Number(id);
  applyImageGenderPreferenceForCurrentItem();
}

function getPreviewImagePath(item, dye = state.dye, gender = state.gender) {
  const racePath = getRacePreviewImages(item)?.[dye]?.[state.previewRace];
  if (racePath) return racePath;
  const entry = getPreviewImages(item)[dye] || getPreviewImages(item).original || {};
  return entry[gender] || entry.common || entry.male || entry.female || "";
}

function getItemPatch(item) {
  const value = Number(item?.patch ?? item?.version ?? item?.addedVersion ?? 0);
  return Number.isFinite(value) ? value : 0;
}

function getAcquisitionEntries(item) {
  if (Array.isArray(item?.acquisition)) return item.acquisition;
  return [];
}

function getAcquisitionTypes(item) {
  return getAcquisitionEntries(item)
    .map((entry) => entry.type || entry.subType || entry.detail || "")
    .filter(Boolean);
}

function uniqueList(values) {
  const result = [];
  values.forEach((value) => {
    if (value && !result.includes(value)) result.push(value);
  });
  return result;
}

function getAcquisitionText(item) {
  const types = uniqueList(getAcquisitionTypes(item));
  if (types.length) return types.slice(0, 3).join(" / ");
  return "获取方式未记录";
}

function getSourceText(item) {
  const category = String(item?.sourceFilterCategory || "").trim();
  const group = String(item?.sourceFilterGroup || "").trim();
  const categoryEntry = getSourceCategories().find((entry) => entry?.id === category);
  const groupEntry = (categoryEntry?.groups || []).find((entry) => entry?.id === group);
  return [
    categoryEntry?.label || category,
    groupEntry?.label || group,
  ].filter(Boolean).join(" / ") || "来源未记录";
}

function getSourceGroupLabel(item) {
  const category = String(item?.sourceFilterCategory || "").trim();
  const group = String(item?.sourceFilterGroup || "").trim();
  const categories = getSourceCategories();
  const categoryEntry = categories.find((entry) => entry?.id === category);
  const groupEntry = (categoryEntry?.groups || []).find((entry) => entry?.id === group) ||
    categories.flatMap((entry) => Array.isArray(entry?.groups) ? entry.groups : []).find((entry) => entry?.id === group);
  return groupEntry?.label || group || categoryEntry?.label || category || "来源未记录";
}

function getAcquisitionDetailText(entry) {
  if (Array.isArray(entry?.detail)) {
    return entry.detail.map((detail) => detail?.text || "").filter(Boolean).join(" / ");
  }
  return [entry?.contentName, entry?.detail, entry?.npcName].filter(Boolean).join(" / ");
}

function renderAcquisitionDetailCell(entry) {
  if (!Array.isArray(entry?.detail)) {
    return escapeHtml(getAcquisitionDetailText(entry) || "详情待接入");
  }
  const details = entry.detail.map((detail) => detail?.text || "").filter(Boolean);
  if (!details.length) return "详情待接入";
  const [main, ...secondary] = details;
  if (entry?.detailSub) secondary.push(String(entry.detailSub));
  return `
    <div class="acquisition-detail-cell">
      <span class="acquisition-detail-cell__main">${escapeHtml(main)}</span>
      ${secondary.length ? `<span class="acquisition-detail-cell__sub">${escapeHtml(secondary.join(" / "))}</span>` : ""}
    </div>
  `;
}

function getAcquisitionTokenText(entry) {
  if (entry?.token) return entry.token;
  if (entry?.price || entry?.currency) return [entry.price, entry.currency].filter(Boolean).join(" ");
  if (!Array.isArray(entry?.costItems)) return "";
  return entry.costItems.map((cost) => `${cost.name || cost.id} x${cost.amount || 1}`).join(" / ");
}

function getAcquisitionEntryKey(entry) {
  const detailText = getAcquisitionDetailText(entry);
  const tokenText = getAcquisitionTokenText(entry);
  return [entry?.type, detailText, tokenText].join("|");
}

function getSourceFieldValues(item) {
  const valuesFrom = (...values) => uniqueList(values.flatMap((value) => {
    if (Array.isArray(value)) return value;
    return value ? [value] : [];
  }).map((value) => String(value).trim()).filter(Boolean));
  return {
    categories: valuesFrom(item?.sourceFilterCategory, item?.sourceFilterCategories),
    groups: valuesFrom(item?.sourceFilterGroup, item?.sourceFilterGroupId, item?.sourceFilterGroups),
    subCategories: valuesFrom(item?.sourceFilterSubCategory, item?.sourceFilterSubcategory, item?.sourceFilterSubCategories, item?.sourceSubCategory),
  };
}

function renderOptions(select, options) {
  if (!select) return;
  const current = select.value || "all";
  select.innerHTML = options.map((option) => `<option value="${escapeHtml(option.value)}">${escapeHtml(option.label)}</option>`).join("");
  select.value = options.some((option) => option.value === current) ? current : "all";
}

function getSourceCategories() {
  return Array.isArray(state.sourceTaxonomy?.categories) ? state.sourceTaxonomy.categories : [];
}

function getSourceCategoryOptions() {
  return [
    { value: "all", label: "全部来源" },
    ...getSourceCategories()
      .filter((category) => category?.id)
      .map((category) => ({ value: category.id, label: category.label || category.id })),
  ];
}

function getSourceGroupOptions(selectedCategory = "all") {
  const categories = getSourceCategories();
  const scopedCategories = selectedCategory === "all"
    ? categories
    : categories.filter((category) => category?.id === selectedCategory);
  const options = [{ value: "all", label: "全部二级来源" }];
  scopedCategories.forEach((category) => {
    (Array.isArray(category?.groups) ? category.groups : []).forEach((group) => {
      if (!group?.id) return;
      const label = selectedCategory === "all"
        ? `${category.label || category.id} / ${group.label || group.id}`
        : group.label || group.id;
      options.push({ value: group.id, label });
    });
  });
  return options;
}

function getWeaponTypeOptions() {
  const types = Array.from(new Set(state.allWeaponPieces.map((item) => item.weaponType || item.weaponSlot).filter(Boolean)))
    .sort((a, b) => a.localeCompare(b, "zh-Hans-CN"));
  return [{ value: "all", label: "全部武器类型" }, ...types.map((type) => ({ value: type, label: type }))];
}

function renderFilterOptions() {
  if (state.currentEngine === "gearSets") renderOptions(dom.equipSlotFilter, GEAR_SET_CATEGORY_OPTIONS);
  else if (state.currentEngine === "weaponPieces") renderOptions(dom.equipSlotFilter, getWeaponTypeOptions());
  else if (state.currentEngine === "accessoryPieces") renderOptions(dom.equipSlotFilter, ACCESSORY_EQUIP_SLOT_OPTIONS);
  else renderOptions(dom.equipSlotFilter, ARMOR_EQUIP_SLOT_OPTIONS);
  if (dom.armorAccessoryFilterGroup) {
    dom.armorAccessoryFilterGroup.hidden = state.currentEngine !== "gearSets";
  }
  if (dom.dyeCrestFilterGroup) {
    dom.dyeCrestFilterGroup.hidden = state.currentEngine === "accessoryPieces" && !isAccessoryGroupView();
  }
  renderOptions(dom.sourceFilter, getSourceCategoryOptions());
  renderOptions(dom.sourceGroupFilter, getSourceGroupOptions(dom.sourceFilter?.value || "all"));
  syncFilterAvailability();
}

function syncFilterAvailability() {
  const onlySlotEnabled = isAccessoryGroupView();
  const disabledControls = [
    dom.searchInput,
    dom.minItemLevelInput,
    dom.maxItemLevelInput,
    dom.minEquipLevelInput,
    dom.maxEquipLevelInput,
    dom.sourceFilter,
    dom.sourceGroupFilter,
    dom.armorOnly,
    dom.accessoryOnly,
    dom.recommendedOnly,
    dom.dresserSetOnly,
    dom.dresserSetOffOnly,
    dom.armoireOnly,
    dom.armoireOffOnly,
    dom.sameModelOnly,
    dom.sameModelOffOnly,
    dom.marketOnly,
    dom.dualDyeOnly,
    dom.dyeOnly,
    dom.noDyeOnly,
    dom.crestOnly,
    dom.sortFilter,
  ].filter(Boolean);
  disabledControls.forEach((control) => {
    control.disabled = onlySlotEnabled;
  });
  const disabledBlocks = [
    dom.minItemLevelInput,
    dom.sourceFilter,
    dom.dresserSetOnly,
    dom.sortFilter,
  ].map((control) => control?.closest(".filter-group-block")).filter(Boolean);
  disabledBlocks.forEach((block) => block.classList.toggle("is-filter-disabled", onlySlotEnabled));
}

function readNumber(input, fallback) {
  if (!input || input.value === "") return fallback;
  const value = Number(input.value);
  return Number.isFinite(value) ? value : fallback;
}

function itemHasSource(item, source) {
  if (source === "all") return true;
  const fields = getSourceFieldValues(item);
  return fields.categories.includes(source) || fields.groups.includes(source) || fields.subCategories.includes(source);
}

function itemMatchesFilters(item) {
  const onlySlotEnabled = isAccessoryGroupView();
  const keyword = onlySlotEnabled ? "" : dom.searchInput.value.trim();
  const slot = dom.equipSlotFilter.value;
  const minIlvl = onlySlotEnabled ? 0 : readNumber(dom.minItemLevelInput, 0);
  const maxIlvl = onlySlotEnabled ? Infinity : readNumber(dom.maxItemLevelInput, Infinity);
  const minElvl = onlySlotEnabled ? 0 : readNumber(dom.minEquipLevelInput, 0);
  const maxElvl = onlySlotEnabled ? Infinity : readNumber(dom.maxEquipLevelInput, Infinity);
  const text = [item.name, item.id, item.equipSlot, item.slotCategory, item.weaponType, item.weaponSlot, getAcquisitionText(item)].join(" ");
  const slotOk = state.currentEngine === "weaponPieces"
    ? slot === "all" || item.weaponType === slot || item.weaponSlot === slot
    : slot === "all" || item.equipSlot === slot || item.slotCategory === slot;
  const dresserValue = state.currentEngine === "weaponPieces" ? item.canDresser : item.canDresserSet;
  const engineSlotOk = state.currentEngine === "gearPieces"
    ? item.slotCategory === "防具"
    : state.currentEngine === "accessoryPieces"
      ? item.slotCategory === "饰品"
      : true;
  return (!keyword || text.includes(keyword)) &&
    engineSlotOk &&
    slotOk &&
    (onlySlotEnabled || (
      item.itemLevel >= minIlvl && item.itemLevel <= maxIlvl &&
      item.equipLevel >= minElvl && item.equipLevel <= maxElvl &&
      itemHasSource(item, dom.sourceFilter.value) &&
      itemHasSource(item, dom.sourceGroupFilter.value) &&
      (!dom.dresserSetOnly.checked || dresserValue) &&
      (!dom.dresserSetOffOnly.checked || !dresserValue) &&
      (!dom.armoireOnly.checked || item.canArmoire) &&
      (!dom.armoireOffOnly.checked || !item.canArmoire) &&
      (!dom.sameModelOnly.checked || item.hasSameModel) &&
      (!dom.sameModelOffOnly.checked || !item.hasSameModel) &&
      (!dom.marketOnly.checked || item.canSellOnMarket) &&
      (!dom.dualDyeOnly.checked || item.canDualDye) &&
      (!dom.dyeOnly.checked || (item.canDye && !item.canDualDye)) &&
      (!dom.noDyeOnly.checked || !item.canDye) &&
      (!dom.crestOnly.checked || item.canCrest)
    ));
}

function normalizeSortPart(value) {
  return String(value ?? "").trim() || "-";
}

function normalizeSortList(value) {
  if (Array.isArray(value)) return value.map(normalizeSortPart).filter((part) => part !== "-");
  const part = normalizeSortPart(value);
  return part === "-" ? [] : [part];
}

function getItemSeriesClusterKey(item) {
  return [
    "inferred",
    normalizeSortPart(item?.slotCategory || item?.type || state.currentEngine),
    Number(item?.itemLevel ?? item?.ilvl ?? 0),
    Number(item?.equipLevel ?? item?.elvl ?? 0),
    normalizeSortPart(item?.sourceFilterCategory),
    normalizeSortPart(item?.sourceFilterGroup),
  ].join("|");
}

function buildItemSeriesClusterSortMeta(items) {
  const clusterMinIds = new Map();
  items.forEach((item) => {
    const key = getItemSeriesClusterKey(item);
    const itemId = Number(item?.id);
    if (!Number.isFinite(itemId)) return;
    const current = clusterMinIds.get(key);
    if (!Number.isFinite(current) || itemId < current) clusterMinIds.set(key, itemId);
  });
  return clusterMinIds;
}

function compareItemsBySeriesCluster(a, b, clusterMinIds) {
  return compareItemsWithinSeriesCluster(a, b, clusterMinIds);
}

function compareItemsWithinSeriesCluster(a, b, clusterMinIds) {
  const aKey = getItemSeriesClusterKey(a);
  const bKey = getItemSeriesClusterKey(b);
  return (clusterMinIds.get(aKey) ?? Number(a.id)) - (clusterMinIds.get(bKey) ?? Number(b.id)) ||
    aKey.localeCompare(bKey, "zh-Hans-CN") ||
    Number(a.id) - Number(b.id);
}

function sortItems(items) {
  const sort = isAccessoryGroupView() ? "default" : dom.sortFilter.value;
  const seriesClusterSortMeta = buildItemSeriesClusterSortMeta(items);
  return [...items].sort((a, b) => {
    if (state.currentEngine === "accessoryPieces" && state.accessoryViewMode === "group" && sort === "default") {
      const aSingle = Number(a.accessoryGroupCount || 1) === 1;
      const bSingle = Number(b.accessoryGroupCount || 1) === 1;
      return Number(bSingle) - Number(aSingle) || Number(b.id) - Number(a.id);
    }
    if (sort === "patchItemLevelId") {
      return getItemPatch(b) - getItemPatch(a) ||
        b.itemLevel - a.itemLevel ||
        compareItemsBySeriesCluster(a, b, seriesClusterSortMeta);
    }
    if (sort === "default") {
      return getItemPatch(b) - getItemPatch(a) ||
        b.itemLevel - a.itemLevel ||
        compareItemsBySeriesCluster(a, b, seriesClusterSortMeta);
    }
    if (sort === "itemLevelDesc") {
      return b.itemLevel - a.itemLevel ||
        compareItemsBySeriesCluster(a, b, seriesClusterSortMeta);
    }
    if (sort === "equipLevelDesc") return b.equipLevel - a.equipLevel || b.itemLevel - a.itemLevel || Number(a.id) - Number(b.id);
    if (sort === "marketFirst") return Number(b.canSellOnMarket) - Number(a.canSellOnMarket) || b.itemLevel - a.itemLevel;
    return getItemPatch(b) - getItemPatch(a) ||
      b.itemLevel - a.itemLevel ||
      compareItemsBySeriesCluster(a, b, seriesClusterSortMeta);
  });
}

function getAccessoryGroupMembers(item) {
  if (!item?.accessorygroupId) return item ? [item] : [];
  return state.allAccessoryPieces
    .filter((candidate) => candidate.accessorygroupId === item.accessorygroupId)
    .sort((a, b) => getItemPatch(b) - getItemPatch(a) || b.itemLevel - a.itemLevel || Number(a.id) - Number(b.id));
}

function getSameModelCandidateItems(item) {
  if (item?.type === "武器散件") return [...state.allWeaponPieces, ...state.sameModelOnlyItems.filter((candidate) => candidate.type === "武器散件")];
  return [...state.allGearPieces, ...state.sameModelOnlyItems.filter((candidate) => candidate.type !== "武器散件")];
}

function buildAccessoryGroupItems(items) {
  const groups = new Map();
  items.forEach((item) => {
    const key = item.accessorygroupId || `accessory-single-${item.id}`;
    if (!groups.has(key)) groups.set(key, []);
    groups.get(key).push(item);
  });
  return Array.from(groups.entries()).map(([groupId, members]) => {
    const sorted = [...members].sort((a, b) => Number(a.id) - Number(b.id));
    const representative = sorted[0];
    return {
      ...representative,
      accessorygroupId: groupId,
      accessoryGroupMembers: sorted.map((item) => item.id),
      accessoryGroupCount: sorted.length,
    };
  });
}

function isSelectedResultItem(item) {
  if (String(item.id) === String(state.selectedItemId)) return true;
  if (state.currentEngine !== "accessoryPieces" || state.accessoryViewMode !== "group") return false;
  const selected = getPieceById(state.selectedItemId);
  return Boolean(selected?.accessorygroupId && item.accessorygroupId === selected.accessorygroupId);
}

function getGearSetId(setEntity) {
  return setEntity?.engine === "gearSets" ? setEntity.data?.setId : setEntity?.data?.id;
}

function getGearSetName(setEntity) {
  return setEntity?.engine === "gearSets"
    ? setEntity.data?.setName || `套装 ${getGearSetId(setEntity)}`
    : setEntity?.data?.name || String(getGearSetId(setEntity) || "");
}

function getGearSetKey(setEntity) {
  return getEntryKey(setEntity.engine, getGearSetId(setEntity));
}

function getGearSetByKey(key) {
  return state.allGearSets.find((setEntity) => getGearSetKey(setEntity) === key) || null;
}

function getGearSetById(engine, id) {
  return state.allGearSets.find((setEntity) => setEntity.engine === engine && String(getGearSetId(setEntity)) === String(id)) || null;
}

function getGearSetPieces(setEntity) {
  if (!setEntity?.data) return [];
  if (setEntity.engine === "gearSets") {
    return (setEntity.data.pieces || [])
      .map((piece) => getGearPieceById(piece.itemId) || (piece.itemId ? { id: piece.itemId, name: piece.name } : null))
      .filter(Boolean);
  }
  return (setEntity.data.pieceIds || []).map(getGearPieceById).filter(Boolean);
}

function getGearSetImageStem(setEntity) {
  const id = getGearSetId(setEntity);
  return id ? `set-${id}` : "";
}

function getGearSetDyeImageDir(dye = "original") {
  return GEAR_SET_DYE_IMAGE_DIRS[dye] || GEAR_SET_DYE_IMAGE_DIRS.original;
}

function getGearSetBodyIcon(setEntity) {
  const pieces = getGearSetPieces(setEntity);
  const bodyPiece = pieces.find((piece) => piece.equipSlot === "身体");
  const armorPiece = pieces.find((piece) => ARMOR_SLOTS.includes(piece.equipSlot));
  return getIconUrl(bodyPiece || armorPiece || pieces[0]);
}

function getGearSetIcon(setEntity) {
  if (setEntity?.engine === "customGearSets") return getGearSetBodyIcon(setEntity);
  const stem = getGearSetImageStem(setEntity);
  return stem ? `images/icons/sets/${stem}.png` : "";
}

function getGearSetGenderRestriction(setEntity) {
  const restrictions = uniqueList(getGearSetPieces(setEntity)
    .map((piece) => piece?.genderRestriction)
    .filter((value) => value === "male" || value === "female"));
  return restrictions.length === 1 ? restrictions[0] : "";
}

function isAccessoryOnlyGearSet(setEntity) {
  const pieces = getGearSetPieces(setEntity);
  return pieces.length > 0 && pieces.every((piece) => ACCESSORY_SLOTS.includes(piece.equipSlot));
}

function getGearSetPreviewGenders(setEntity) {
  if (isAccessoryOnlyGearSet(setEntity)) return [];
  const restriction = getGearSetGenderRestriction(setEntity);
  if (restriction === "male") return ["male"];
  if (restriction === "female") return ["female"];
  return ["male", "female"];
}

function getGearSetGenderImageSuffix(gender = state.gender) {
  return gender === "female" ? "f" : "m";
}

function getGearSetPreviewImageCandidates(setEntity, dye = state.dye, gender = state.gender) {
  const stem = getGearSetImageStem(setEntity);
  if (!stem) return [];
  const dirs = uniqueList([getGearSetDyeImageDir(dye), GEAR_SET_DYE_IMAGE_DIRS.original]);
  if (isAccessoryOnlyGearSet(setEntity)) {
    return dirs.flatMap((dir) => GEAR_SET_IMAGE_EXTENSIONS.map((extension) => `images/sets/${dir}/${stem}.${extension}`));
  }
  const suffix = getGearSetGenderImageSuffix(gender);
  return dirs.flatMap((dir) => GEAR_SET_IMAGE_EXTENSIONS.flatMap((extension) => [
    `images/sets/${dir}/${stem}-${suffix}.${extension}`,
    `images/sets/${dir}/${stem}.${extension}`,
  ]));
}

function getGearSetPreviewImagePath(setEntity, dye = state.dye, gender = state.gender) {
  return getGearSetPreviewImageCandidates(setEntity, dye, gender)[0] || "";
}

function getGearSetRepresentativePreviewImagePath(setEntity) {
  return getGearSetPreviewImagePath(setEntity, "original");
}

function getAvailableGearSetPreviewGenders(setEntity) {
  if (state.previewGearSetPieceId) {
    const piece = getGearPieceById(state.previewGearSetPieceId);
    return getAvailablePreviewGenders(piece);
  }
  return getGearSetPreviewGenders(setEntity);
}

function getGearSetVisualPieces(setEntity) {
  const pieces = getGearSetPieces(setEntity);
  const armor = pieces.filter((piece) => ARMOR_SLOTS.includes(piece.equipSlot));
  return armor.length ? armor : pieces;
}

function gearSetPiecesHaveAny(setEntity, field) {
  return getGearSetPieces(setEntity).some((piece) => Boolean(piece[field]));
}

function gearSetCanDyeForPreview(setEntity) {
  return getGearSetVisualPieces(setEntity).some((piece) => piece.canDye);
}

function gearSetCanDualDyeForPreview(setEntity) {
  return getGearSetVisualPieces(setEntity).some((piece) => piece.canDualDye);
}

function gearSetMaxNumber(setEntity, field, fallbackField) {
  const values = getGearSetPieces(setEntity)
    .map((piece) => Number(piece[field] ?? piece[fallbackField] ?? 0))
    .filter(Number.isFinite);
  return values.length ? Math.max(...values) : 0;
}

function getGearSetPatch(setEntity) {
  const direct = getItemPatch(setEntity?.data);
  if (direct) return direct;
  const versions = getGearSetPieces(setEntity).map(getItemPatch).filter(Boolean);
  return versions.length ? Math.max(...versions) : 0;
}

function getGearSetArmorBySlot(setEntity) {
  const pieces = getGearSetPieces(setEntity);
  return Object.fromEntries(ARMOR_SLOTS.map((slot) => [slot, pieces.find((piece) => piece.equipSlot === slot) || null]));
}

function areSharedModelPieces(a, b) {
  if (!a || !b) return false;
  if (String(a.id) === String(b.id)) return true;
  const aShared = Array.isArray(a.sharedModels) ? a.sharedModels.map(String) : [];
  const bShared = Array.isArray(b.sharedModels) ? b.sharedModels.map(String) : [];
  return aShared.includes(String(b.id)) || bShared.includes(String(a.id));
}

function countMatchingArmorModelSlots(a, b) {
  const aPieces = getGearSetArmorBySlot(a);
  const bPieces = getGearSetArmorBySlot(b);
  return ARMOR_SLOTS.reduce((sum, slot) => sum + (areSharedModelPieces(aPieces[slot], bPieces[slot]) ? 1 : 0), 0);
}

function getSimilarGearSets(setEntity) {
  return state.allGearSets
    .filter((candidate) => getGearSetKey(candidate) !== getGearSetKey(setEntity))
    .map((candidate) => ({ setEntity: candidate, count: countMatchingArmorModelSlots(setEntity, candidate) }))
    .filter((entry) => entry.count >= 3)
    .sort((a, b) => b.count - a.count || getGearSetName(a.setEntity).localeCompare(getGearSetName(b.setEntity), "zh-Hans-CN"))
    .map((entry) => entry.setEntity);
}

function countMatchingSeriesGearSets(a, b) {
  const pairs = [];
  getSeriesGearSets(a).forEach((leftSet, leftIndex) => {
    getSeriesGearSets(b).forEach((rightSet, rightIndex) => {
      const count = countMatchingArmorModelSlots(leftSet, rightSet);
      if (count >= 3) pairs.push({ leftIndex, rightIndex, count });
    });
  });
  pairs.sort((left, right) => right.count - left.count);
  const usedLeft = new Set();
  const usedRight = new Set();
  let matches = 0;
  pairs.forEach((pair) => {
    if (usedLeft.has(pair.leftIndex) || usedRight.has(pair.rightIndex)) return;
    usedLeft.add(pair.leftIndex);
    usedRight.add(pair.rightIndex);
    matches += 1;
  });
  return matches;
}

function countMatchingSeriesPieces(a, b) {
  const bPieces = getSeriesPieces(b);
  return getSeriesPieces(a).reduce((sum, piece) => {
    const hasMatch = bPieces.some((candidate) => areSharedModelPieces(piece, candidate));
    return sum + (hasMatch ? 1 : 0);
  }, 0);
}

function getSimilarSeries(seriesEntity) {
  const source = seriesEntity?.engine === "weaponSeries" ? state.allWeaponSeries : state.allGearSeries;
  const isGearSeries = seriesEntity?.engine === "gearSeries";
  return source
    .filter((candidate) => getSeriesKey(candidate) !== getSeriesKey(seriesEntity))
    .map((candidate) => ({
      seriesEntity: candidate,
      count: isGearSeries ? countMatchingSeriesGearSets(seriesEntity, candidate) : countMatchingSeriesPieces(seriesEntity, candidate),
    }))
    .filter((entry) => entry.count > (isGearSeries ? getSeriesGearSets(seriesEntity).length / 2 : 2))
    .sort((a, b) => b.count - a.count || getSeriesName(a.seriesEntity).localeCompare(getSeriesName(b.seriesEntity), "zh-Hans-CN"))
    .map((entry) => entry.seriesEntity);
}

function getGearSetAcquisitionText(setEntity) {
  const acquisitionTexts = Array.from(new Set(getGearSetPieces(setEntity).map(getAcquisitionText).filter(Boolean)));
  if (acquisitionTexts.length === 0) return "获取方式未记录";
  return acquisitionTexts.length > 3 ? `${acquisitionTexts.slice(0, 3).join(" / ")} 等` : acquisitionTexts.join(" / ");
}

function getGearSetSourceText(setEntity) {
  const sourceTexts = Array.from(new Set(getGearSetPieces(setEntity).map(getSourceText).filter(Boolean)));
  if (sourceTexts.length === 0) return "来源未记录";
  return sourceTexts.length > 3 ? `${sourceTexts.slice(0, 3).join(" / ")} 等` : sourceTexts.join(" / ");
}

function getGearSetCategory(setEntity) {
  const pieces = getGearSetPieces(setEntity);
  const isAccessory = pieces.length > 0 && pieces.every((piece) => ACCESSORY_SLOTS.includes(piece.equipSlot));
  const text = `${getGearSetName(setEntity)} ${pieces.map((piece) => piece.name).join(" ")}`;
  if (/巧匠|大地|刻木|锻铁|铸甲|雕金|制革|裁衣|炼金|烹调|采矿|园艺|捕鱼/.test(text)) {
    return isAccessory ? "craftGatherAccessory" : "craftGatherArmor";
  }
  if (/御敌|制敌|强袭|精准|游击|治愈|咏咒|侦查/.test(text)) {
    return isAccessory ? "combatAccessory" : "combatArmor";
  }
  return "other";
}

function gearSetMatchesFilters(setEntity) {
  const keyword = dom.searchInput.value.trim();
  const itemLevel = gearSetMaxNumber(setEntity, "ilvl", "itemLevel");
  const equipLevel = gearSetMaxNumber(setEntity, "elvl", "equipLevel");
  const minIlvl = readNumber(dom.minItemLevelInput, 0);
  const maxIlvl = readNumber(dom.maxItemLevelInput, Infinity);
  const minElvl = readNumber(dom.minEquipLevelInput, 0);
  const maxElvl = readNumber(dom.maxEquipLevelInput, Infinity);
  const text = `${getGearSetName(setEntity)} ${getGearSetId(setEntity)} ${getGearSetSourceText(setEntity)} ${getGearSetPieces(setEntity).map((piece) => piece.name).join(" ")}`;
  return (!keyword || text.includes(keyword)) &&
    (dom.equipSlotFilter.value === "all" || getGearSetCategory(setEntity) === dom.equipSlotFilter.value) &&
    itemLevel >= minIlvl && itemLevel <= maxIlvl &&
    equipLevel >= minElvl && equipLevel <= maxElvl &&
    (!dom.dresserSetOnly.checked || gearSetPiecesHaveAny(setEntity, "canDresserSet")) &&
    (!dom.dresserSetOffOnly.checked || !gearSetPiecesHaveAny(setEntity, "canDresserSet")) &&
    (!dom.armoireOnly.checked || gearSetPiecesHaveAny(setEntity, "canArmoire")) &&
    (!dom.armoireOffOnly.checked || !gearSetPiecesHaveAny(setEntity, "canArmoire")) &&
    (!dom.marketOnly.checked || getGearSetPieces(setEntity).some((piece) => piece.canSellOnMarket)) &&
    (!dom.dualDyeOnly.checked || gearSetCanDualDyeForPreview(setEntity)) &&
    (!dom.dyeOnly.checked || gearSetCanDyeForPreview(setEntity)) &&
    (!dom.noDyeOnly.checked || !gearSetCanDyeForPreview(setEntity));
}

function sortGearSets(sets) {
  const sort = dom.sortFilter.value;
  return [...sets].sort((a, b) => {
    if (sort === "patchItemLevelId" || sort === "default") {
      return getGearSetPatch(b) - getGearSetPatch(a) ||
        gearSetMaxNumber(b, "ilvl", "itemLevel") - gearSetMaxNumber(a, "ilvl", "itemLevel") ||
        String(getGearSetId(a)).localeCompare(String(getGearSetId(b)));
    }
    if (sort === "itemLevelDesc") return gearSetMaxNumber(b, "ilvl", "itemLevel") - gearSetMaxNumber(a, "ilvl", "itemLevel");
    if (sort === "equipLevelDesc") return gearSetMaxNumber(b, "elvl", "equipLevel") - gearSetMaxNumber(a, "elvl", "equipLevel");
    return getGearSetPatch(b) - getGearSetPatch(a) ||
      gearSetMaxNumber(b, "ilvl", "itemLevel") - gearSetMaxNumber(a, "ilvl", "itemLevel") ||
      String(getGearSetId(a)).localeCompare(String(getGearSetId(b)));
  });
}

function buildGearSets() {
  const official = state.officialGearSets.map((data) => ({ engine: "gearSets", data }));
  const custom = state.customGearSets.map((data) => ({ engine: "customGearSets", data }));
  return [...official, ...custom].filter((setEntity) => getGearSetPieces(setEntity).length > 0);
}

function getSeriesId(seriesEntity) {
  return seriesEntity?.data?.id;
}

function getSeriesName(seriesEntity) {
  return seriesEntity?.data?.name || `${ENGINE_LABELS[seriesEntity?.engine] || "系列"} ${getSeriesId(seriesEntity) || ""}`;
}

function getSeriesKey(seriesEntity) {
  return getEntryKey(seriesEntity.engine, getSeriesId(seriesEntity));
}

function getSeriesByKey(key) {
  return state.allSeries.find((seriesEntity) => getSeriesKey(seriesEntity) === key) || null;
}

function getSeriesGearSets(seriesEntity) {
  if (seriesEntity?.engine !== "gearSeries") return [];
  const gameSets = (seriesEntity.data?.gameSetIds || []).map((id) => getGearSetById("gearSets", id)).filter(Boolean);
  const customSets = (seriesEntity.data?.customSetIds || []).map((id) => getGearSetById("customGearSets", id)).filter(Boolean);
  return [...gameSets, ...customSets];
}

function getSeriesPieces(seriesEntity) {
  const seen = new Set();
  const pieces = [];
  const pushPiece = (piece) => {
    if (!piece?.id || seen.has(String(piece.id))) return;
    seen.add(String(piece.id));
    pieces.push(piece);
  };
  if (seriesEntity?.engine === "weaponSeries") {
    (seriesEntity.data?.weaponIds || []).map((id) => state.weaponPiecesById.get(String(id))).forEach(pushPiece);
    return pieces;
  }
  getSeriesGearSets(seriesEntity).flatMap(getGearSetPieces).forEach(pushPiece);
  (seriesEntity?.data?.pieceIds || []).map(getGearPieceById).forEach(pushPiece);
  return pieces;
}

function getWeaponSeriesDisplayRank(piece) {
  const type = String(piece?.weaponType || piece?.weaponSlot || "");
  if (type === "单手剑") return 0;
  if (type === "盾") return 1;
  return 2;
}

function sortWeaponSeriesPiecesForDisplay(pieces) {
  return [...pieces].sort((a, b) =>
    getWeaponSeriesDisplayRank(a) - getWeaponSeriesDisplayRank(b) ||
    String(a.weaponType || a.weaponSlot || "").localeCompare(String(b.weaponType || b.weaponSlot || ""), "zh-Hans-CN") ||
    String(a.name || "").localeCompare(String(b.name || ""), "zh-Hans-CN") ||
    Number(a.id || 0) - Number(b.id || 0)
  );
}

function getSeriesIcon(seriesEntity) {
  const preview = getSeriesPreviewImagePath(seriesEntity);
  if (preview) return preview;
  if (seriesEntity?.engine === "gearSeries") {
    const setIcon = getSeriesGearSets(seriesEntity).map(getGearSetIcon).find(Boolean);
    if (setIcon) return setIcon;
  }
  return getIconUrl(getSeriesPieces(seriesEntity)[0]);
}

function getSeriesPreviewImagePath(seriesEntity, dye = state.dye, gender = state.gender) {
  const entry = (seriesEntity?.data?.previewImages || {})[dye] || (seriesEntity?.data?.previewImages || {}).original || {};
  return entry[gender] || entry.common || entry.male || entry.female || "";
}

function getSeriesPreviewImageCandidates(seriesEntity, dye = state.dye, gender = state.gender) {
  const direct = getSeriesPreviewImagePath(seriesEntity, dye, gender);
  if (direct) return [direct];
  if (seriesEntity?.engine === "gearSeries") {
    return getSeriesGearSets(seriesEntity).flatMap((setEntity) => getGearSetPreviewImageCandidates(setEntity, dye, gender));
  }
  return [getIconUrl(getSeriesPieces(seriesEntity)[0])].filter(Boolean);
}

function getAvailableSeriesPreviewGenders(seriesEntity) {
  const genders = new Set();
  Object.values(seriesEntity?.data?.previewImages || {}).forEach((entry) => {
    if (!entry || typeof entry !== "object") return;
    if (entry.male) genders.add("male");
    if (entry.female) genders.add("female");
  });
  if (seriesEntity?.engine === "gearSeries") {
    getSeriesGearSets(seriesEntity)
      .flatMap(getGearSetPreviewGenders)
      .forEach((gender) => genders.add(gender));
  }
  return ["male", "female"].filter((gender) => genders.has(gender));
}

function seriesMaxNumber(seriesEntity, field, fallbackField) {
  const direct = Number(seriesEntity?.data?.[field] ?? seriesEntity?.data?.[fallbackField]);
  if (Number.isFinite(direct) && direct > 0) return direct;
  const values = getSeriesPieces(seriesEntity)
    .map((piece) => Number(piece[field] ?? piece[fallbackField] ?? 0))
    .filter(Number.isFinite);
  return values.length ? Math.max(...values) : 0;
}

function getSeriesPatch(seriesEntity) {
  const direct = getItemPatch(seriesEntity?.data);
  if (direct) return direct;
  const versions = getSeriesPieces(seriesEntity).map(getItemPatch).filter(Boolean);
  return versions.length ? Math.max(...versions) : 0;
}

function getSeriesSourceText(seriesEntity) {
  const direct = [seriesEntity?.data?.sourceCategory, seriesEntity?.data?.sourceSubCategory].filter(Boolean).join(" / ");
  if (direct) return direct;
  const sourceTexts = uniqueList(getSeriesPieces(seriesEntity).map(getSourceText).filter(Boolean));
  if (!sourceTexts.length) return "来源未记录";
  return sourceTexts.length > 3 ? `${sourceTexts.slice(0, 3).join(" / ")} 等` : sourceTexts.join(" / ");
}

function seriesHasAny(seriesEntity, field) {
  if (field in (seriesEntity?.data || {})) return Boolean(seriesEntity.data[field]);
  return getSeriesPieces(seriesEntity).some((piece) => Boolean(piece[field]));
}

function renderSeriesCardStatusIcons(seriesEntity, options = {}) {
  const canDresserSet = seriesEntity.engine === "gearSeries" && seriesHasAny(seriesEntity, "canDresserSet");
  const canDresser = seriesEntity.engine === "weaponSeries" && seriesHasAny(seriesEntity, "canDresser");
  const canDye = getSeriesPieces(seriesEntity).some((piece) => piece.canDye);
  const canDualDye = getSeriesPieces(seriesEntity).some((piece) => piece.canDualDye);
  const canArmoire = seriesHasAny(seriesEntity, "canArmoire");
  const canSellOnMarket = getSeriesPieces(seriesEntity).some((piece) => piece.canSellOnMarket);
  return [
    seriesEntity.engine === "weaponSeries"
      ? renderCardStatusIcon(`images/ui/item-detail-icons/${canDresser ? "icon-r2-c2" : "icon-r1-c2"}.png`, canDresser ? "含可加入投影台武器" : "不含投影台武器", !canDresser)
      : renderCardStatusIcon(`images/ui/item-detail-icons/${canDresserSet ? "dresser-set-on" : "dresser-set-off"}.png`, canDresserSet ? "含可成套加入投影台装备" : "不含成套投影台装备", !canDresserSet),
    renderCardDyeIcon(canDye, canDualDye),
    renderCardStatusIcon(`images/ui/item-detail-icons/${canArmoire ? "armoire-on" : "armoire-off"}.png`, canArmoire ? "含收藏柜装备" : "不含收藏柜装备", !canArmoire),
    renderMarketIcon(canSellOnMarket, options.alwaysShowMarket),
  ].filter(Boolean).join("");
}

function renderSeriesCoreStatusIcons(seriesEntity) {
  const canDresserSet = seriesEntity.engine === "gearSeries" && seriesHasAny(seriesEntity, "canDresserSet");
  const canDresser = seriesEntity.engine === "weaponSeries" && seriesHasAny(seriesEntity, "canDresser");
  const canDye = getSeriesPieces(seriesEntity).some((piece) => piece.canDye);
  const canDualDye = getSeriesPieces(seriesEntity).some((piece) => piece.canDualDye);
  const canArmoire = seriesHasAny(seriesEntity, "canArmoire");
  return [
    seriesEntity.engine === "weaponSeries"
      ? renderCardStatusIcon(`images/ui/item-detail-icons/${canDresser ? "icon-r2-c2" : "icon-r1-c2"}.png`, canDresser ? "含可加入投影台武器" : "不含投影台武器", !canDresser)
      : renderCardStatusIcon(`images/ui/item-detail-icons/${canDresserSet ? "dresser-set-on" : "dresser-set-off"}.png`, canDresserSet ? "含可成套加入投影台装备" : "不含成套投影台装备", !canDresserSet),
    renderCardDyeIcon(canDye, canDualDye),
    renderCardStatusIcon(`images/ui/item-detail-icons/${canArmoire ? "armoire-on" : "armoire-off"}.png`, canArmoire ? "含收藏柜装备" : "不含收藏柜装备", !canArmoire),
  ].filter(Boolean).join("");
}

function seriesMatchesFilters(seriesEntity) {
  const keyword = dom.searchInput.value.trim();
  const itemLevel = seriesMaxNumber(seriesEntity, "maxItemLevel", "itemLevel");
  const equipLevel = seriesMaxNumber(seriesEntity, "maxEquipLevel", "equipLevel");
  const minIlvl = readNumber(dom.minItemLevelInput, 0);
  const maxIlvl = readNumber(dom.maxItemLevelInput, Infinity);
  const minElvl = readNumber(dom.minEquipLevelInput, 0);
  const maxElvl = readNumber(dom.maxEquipLevelInput, Infinity);
  const text = [
    getSeriesName(seriesEntity),
    getSeriesId(seriesEntity),
    getSeriesSourceText(seriesEntity),
    ...(seriesEntity.data?.keywords || []),
    ...getSeriesGearSets(seriesEntity).map(getGearSetName),
    ...getSeriesPieces(seriesEntity).map((piece) => piece.name),
  ].join(" ");
  return (!keyword || text.includes(keyword)) &&
    itemLevel >= minIlvl && itemLevel <= maxIlvl &&
    equipLevel >= minElvl && equipLevel <= maxElvl &&
    (!dom.dresserSetOnly.checked || seriesHasAny(seriesEntity, seriesEntity.engine === "weaponSeries" ? "canDresser" : "canDresserSet")) &&
    (!dom.dresserSetOffOnly.checked || !seriesHasAny(seriesEntity, seriesEntity.engine === "weaponSeries" ? "canDresser" : "canDresserSet")) &&
    (!dom.armoireOnly.checked || seriesHasAny(seriesEntity, "canArmoire")) &&
    (!dom.armoireOffOnly.checked || !seriesHasAny(seriesEntity, "canArmoire")) &&
    (!dom.marketOnly.checked || getSeriesPieces(seriesEntity).some((piece) => piece.canSellOnMarket)) &&
    (!dom.dualDyeOnly.checked || getSeriesPieces(seriesEntity).some((piece) => piece.canDualDye)) &&
    (!dom.dyeOnly.checked || getSeriesPieces(seriesEntity).some((piece) => piece.canDye)) &&
    (!dom.noDyeOnly.checked || !getSeriesPieces(seriesEntity).some((piece) => piece.canDye));
}

function sortSeries(series) {
  return [...series].sort((a, b) =>
    getSeriesPatch(b) - getSeriesPatch(a) ||
    seriesMaxNumber(b, "maxItemLevel", "itemLevel") - seriesMaxNumber(a, "maxItemLevel", "itemLevel") ||
    String(getSeriesId(a)).localeCompare(String(getSeriesId(b)), "zh-Hans-CN")
  );
}

function buildSeries(gearSeriesData, weaponSeriesData) {
  state.allGearSeries = (Array.isArray(gearSeriesData?.series) ? gearSeriesData.series : [])
    .map((data) => ({ engine: "gearSeries", data }))
    .filter((seriesEntity) => getSeriesGearSets(seriesEntity).length > 0 || getSeriesPieces(seriesEntity).length > 0);
  state.allWeaponSeries = (Array.isArray(weaponSeriesData?.series) ? weaponSeriesData.series : [])
    .map((data) => ({ engine: "weaponSeries", data }))
    .filter((seriesEntity) => getSeriesPieces(seriesEntity).length > 0);
  state.allSeries = [...state.allGearSeries, ...state.allWeaponSeries];
}

function renderCardStatusIcon(src, label, muted = false, extra = "") {
  return `<span class="card-status-icon-tag ${muted ? "is-muted" : ""}" title="${escapeHtml(label)}" aria-label="${escapeHtml(label)}"><img class="card-status-icon" src="${escapeHtml(src)}" alt="" />${extra}</span>`;
}

function renderCardDyeIcon(canDye, canDualDye) {
  const dots = canDualDye
    ? `<span class="card-dye-dots"><span></span><span></span></span>`
    : canDye
      ? `<span class="card-dye-dots"><span></span></span>`
      : "";
  return renderCardStatusIcon("images/ui/item-detail-icons/dye-status.png", canDualDye ? "双染色" : canDye ? "单染色" : "不可染", !canDye, dots);
}

function renderMarketIcon(canSellOnMarket, alwaysShow = false) {
  if (canSellOnMarket) return renderCardStatusIcon("images/ui/item-detail-icons/market-on.png", "市场可售");
  return alwaysShow ? renderCardStatusIcon("images/ui/item-detail-icons/market-on.png", "市场不可售", true) : "";
}

function renderGenderRestrictionIcon(item) {
  if (item?.genderRestriction === "male") {
    return renderCardStatusIcon("images/ui/item-detail-icons/gender-male.svg", "男性专用");
  }
  if (item?.genderRestriction === "female") {
    return renderCardStatusIcon("images/ui/item-detail-icons/gender-female.svg", "女性专用");
  }
  return "";
}

function renderGearSetGenderRestrictionIcon(setEntity) {
  const restriction = getGearSetGenderRestriction(setEntity);
  if (restriction === "male") {
    return renderCardStatusIcon("images/ui/item-detail-icons/gender-male.svg", "男性专用套装");
  }
  if (restriction === "female") {
    return renderCardStatusIcon("images/ui/item-detail-icons/gender-female.svg", "女性专用套装");
  }
  return "";
}

function renderItemCardStatusIcons(item, options = {}) {
  const isWeapon = options.isWeapon ?? item?.type === "武器散件";
  const isAccessory = options.isAccessory ?? item?.slotCategory === "饰品";
  const dresserValue = isWeapon ? item.canDresser : item.canDresserSet;
  const dresserLabel = isWeapon
    ? dresserValue ? "可加入投影台" : "不可加入投影台"
    : dresserValue ? "可成套加入投影台" : "不可成套加入投影台";
  const dresserIcon = isWeapon
    ? `images/ui/item-detail-icons/${dresserValue ? "icon-r2-c2" : "icon-r1-c2"}.png`
    : `images/ui/item-detail-icons/${dresserValue ? "dresser-set-on" : "dresser-set-off"}.png`;
  return [
    renderCardStatusIcon(dresserIcon, dresserLabel, !dresserValue),
    isAccessory ? "" : renderCardDyeIcon(item.canDye, item.canDualDye),
    renderCardStatusIcon(`images/ui/item-detail-icons/${item.canArmoire ? "armoire-on" : "armoire-off"}.png`, item.canArmoire ? "可加入收藏柜" : "不可加入收藏柜", !item.canArmoire),
    isAccessory ? "" : renderCardStatusIcon(`images/ui/item-detail-icons/${item.canCrest ? "crest-on" : "crest-off"}.png`, item.canCrest ? "可添加部队徽记" : "不可添加部队徽记", !item.canCrest),
    renderMarketIcon(item.canSellOnMarket),
    options.showGender ? renderGenderRestrictionIcon(item) : "",
  ].filter(Boolean).join("");
}

function renderGearSetCardStatusIcons(setEntity, options = {}) {
  const canDresserSet = setEntity.engine === "gearSets" && gearSetPiecesHaveAny(setEntity, "canDresserSet");
  const canDye = gearSetCanDyeForPreview(setEntity);
  const canDualDye = gearSetCanDualDyeForPreview(setEntity);
  const canArmoire = gearSetPiecesHaveAny(setEntity, "canArmoire");
  const canSellOnMarket = getGearSetPieces(setEntity).some((piece) => piece.canSellOnMarket);
  return [
    renderCardStatusIcon(`images/ui/item-detail-icons/${canDresserSet ? "dresser-set-on" : "dresser-set-off"}.png`, canDresserSet ? "可成套加入投影台" : "不可成套加入投影台", !canDresserSet),
    renderCardDyeIcon(canDye, canDualDye),
    renderCardStatusIcon(`images/ui/item-detail-icons/${canArmoire ? "armoire-on" : "armoire-off"}.png`, canArmoire ? "含收藏柜装备" : "不含收藏柜装备", !canArmoire),
    renderMarketIcon(canSellOnMarket, options.alwaysShowMarket),
    renderGearSetGenderRestrictionIcon(setEntity),
  ].filter(Boolean).join("");
}

function renderDresserTag(item, className) {
  if (state.currentEngine === "weaponPieces") {
    return item.canDresser
      ? `<span class="${className} ${className}--green">可加入投影台</span>`
      : `<span class="${className} is-muted">不可加入投影台</span>`;
  }
  if (item.canDresserSet) return `<span class="${className} ${className}--gold">可成套加入投影台</span>`;
  if (item.canDresser) return `<span class="${className} ${className}--green">单独加入投影台</span>`;
  return `<span class="${className} is-muted">不可加入投影台</span>`;
}

function renderStatusTags(item, variant = "detail") {
  const className = variant === "detail" ? "info-tag" : "result-chip";
  const isAccessory = state.currentEngine === "accessoryPieces" || item?.slotCategory === "饰品";
  return [
    renderDresserTag(item, className),
    isAccessory ? "" : item.canDualDye ? `<span class="${className} ${className}--gold">双染色</span>` : item.canDye ? `<span class="${className} ${className}--green">单染色</span>` : `<span class="${className} is-muted">不可染</span>`,
    item.canArmoire ? `<span class="${className} ${className}--gold">收藏柜</span>` : `<span class="${className} is-muted">非收藏柜</span>`,
    isAccessory ? "" : item.canCrest ? `<span class="${className} ${className}--gold">部队徽记</span>` : `<span class="${className} is-muted">无部队徽记</span>`,
    item.canSellOnMarket ? `<span class="${className}">市场可售</span>` : `<span class="${className} is-muted">市场不可售</span>`,
    variant === "detail" ? item.isUnique ? `<span class="${className} is-muted">不可重复持有</span>` : `<span class="${className}">可重复持有</span>` : "",
  ].filter(Boolean).join("");
}

function renderResultCards() {
  if (state.filteredItems.length === 0) {
    dom.resultList.innerHTML = `<div class="empty-result"><p>没有找到符合条件的${getPieceLabel()}。</p></div>`;
    return;
  }
  const selectedIndex = state.filteredItems.findIndex(isSelectedResultItem);
  if (selectedIndex >= state.visibleItemCount) {
    state.visibleItemCount = selectedIndex + 1;
  }
  const items = state.filteredItems.slice(0, state.visibleItemCount);
  const prefix = state.currentEngine === "weaponPieces"
    ? "weapon-pieces-result-card"
    : state.currentEngine === "accessoryPieces"
      ? "accessory-pieces-result-card"
      : "result-card";
  dom.resultList.innerHTML = items.map((item) => {
    const key = getItemKey(item);
    const inWishlist = collectionHasAll(state.wishlistIds, key);
    const inFavorites = collectionHasAll(state.favoriteIds, key);
    const isAccessoryCard = state.currentEngine === "accessoryPieces";
    const isAccessoryGroupCard = isAccessoryCard && item.accessoryGroupCount > 1;
    const titleText = isAccessoryGroupCard ? item.accessorygroupId || item.name : item.name;
    const groupCountText = state.currentEngine === "accessoryPieces" && item.accessoryGroupCount > 1
      ? ` / 同模 ${item.accessoryGroupCount} 件`
      : "";
    return `
      <article class="${prefix} ${isSelectedResultItem(item) ? "is-selected" : ""}" data-item-id="${escapeHtml(item.id)}">
        <button class="wishlist-button wishlist-button--card ${inWishlist ? "is-active" : ""}" type="button" data-wishlist-toggle data-item-id="${escapeHtml(key)}" aria-pressed="${inWishlist}" aria-label="加入愿望单"></button>
        <button class="favorite-button favorite-button--card ${inFavorites ? "is-active" : ""}" type="button" data-favorite-toggle data-item-id="${escapeHtml(key)}" aria-pressed="${inFavorites}" aria-label="加入收藏"></button>
        <img ${renderIconImageAttrs(item, `${prefix}__icon`)} />
        <div class="${prefix}__body">
          <div class="${prefix}__title-row">
            <h3 class="${prefix}__title">${escapeHtml(titleText)}</h3>
            ${isAccessoryGroupCard ? "" : `<span class="${prefix}__id">#${escapeHtml(item.id)}</span>`}
          </div>
          <div class="${prefix}__meta">品级：${escapeHtml(item.itemLevel)} / 装备等级：${escapeHtml(item.equipLevel)}${escapeHtml(groupCountText)}</div>
          <div class="${prefix}__source">来源：${escapeHtml(getSourceText(item))}</div>
          <div class="${prefix}__tags">${renderItemCardStatusIcons(item, { showGender: true })}</div>
        </div>
      </article>
    `;
  }).join("") + (state.visibleItemCount < state.filteredItems.length
    ? `<button class="result-load-more" type="button" data-load-more-results>加载更多（已显示 ${Math.min(state.visibleItemCount, state.filteredItems.length)} / 共 ${state.filteredItems.length} 条）</button>`
    : "");
}

function renderGearSetResultCards() {
  if (state.filteredGearSets.length === 0) {
    dom.resultList.innerHTML = `<div class="empty-result"><p>没有找到符合条件的套装。</p></div>`;
    return;
  }
  if (state.selectedGearSet) {
    const selectedIndex = state.filteredGearSets.findIndex((setEntity) => getGearSetKey(setEntity) === getGearSetKey(state.selectedGearSet));
    if (selectedIndex >= state.visibleItemCount) state.visibleItemCount = selectedIndex + 1;
  }
  const sets = state.filteredGearSets.slice(0, state.visibleItemCount);
  dom.resultList.innerHTML = sets.map((setEntity) => {
    const id = getGearSetId(setEntity);
    const key = getGearSetKey(setEntity);
    const inWishlist = collectionHasAll(state.wishlistIds, key);
    const inFavorites = collectionHasAll(state.favoriteIds, key);
    return `
      <article class="gear-sets-result-card ${state.selectedGearSet && getGearSetKey(state.selectedGearSet) === key ? "is-selected" : ""}" data-set-engine="${escapeHtml(setEntity.engine)}" data-set-id="${escapeHtml(id)}">
        <button class="wishlist-button wishlist-button--card ${inWishlist ? "is-active" : ""}" type="button" data-wishlist-toggle data-item-id="${escapeHtml(key)}" aria-pressed="${inWishlist}" aria-label="加入愿望单"></button>
        <button class="favorite-button favorite-button--card ${inFavorites ? "is-active" : ""}" type="button" data-favorite-toggle data-item-id="${escapeHtml(key)}" aria-pressed="${inFavorites}" aria-label="加入收藏"></button>
        <img class="gear-sets-result-card__icon" src="${escapeHtml(getGearSetIcon(setEntity))}" alt="" />
        <div class="gear-sets-result-card__body">
          <div class="gear-sets-result-card__title-row">
            <h3 class="gear-sets-result-card__title">${escapeHtml(getGearSetName(setEntity))}</h3>
            <span class="gear-sets-result-card__id">#${escapeHtml(id)}</span>
          </div>
          <div class="gear-sets-result-card__meta">品级：${escapeHtml(gearSetMaxNumber(setEntity, "ilvl", "itemLevel"))} / 装备等级：${escapeHtml(gearSetMaxNumber(setEntity, "elvl", "equipLevel"))} / ${escapeHtml(getGearSetPieces(setEntity).length)} 件</div>
          <div class="gear-sets-result-card__source">来源：${escapeHtml(getGearSetSourceText(setEntity))}</div>
          <div class="gear-sets-result-card__tags">${renderGearSetCardStatusIcons(setEntity, { alwaysShowMarket: true })}</div>
        </div>
      </article>
    `;
  }).join("") + (state.visibleItemCount < state.filteredGearSets.length
    ? `<button class="result-load-more" type="button" data-load-more-results>加载更多（已显示 ${Math.min(state.visibleItemCount, state.filteredGearSets.length)} / 共 ${state.filteredGearSets.length} 条）</button>`
    : "");
}

function renderSeriesResultCards() {
  const series = state.filteredSeries;
  const label = ENGINE_LABELS[state.currentEngine] || "系列";
  if (series.length === 0) {
    dom.resultList.innerHTML = `<div class="empty-result"><p>没有找到符合条件的${label}。</p></div>`;
    return;
  }
  if (state.selectedSeries) {
    const selectedIndex = series.findIndex((seriesEntity) => getSeriesKey(seriesEntity) === getSeriesKey(state.selectedSeries));
    if (selectedIndex >= state.visibleItemCount) state.visibleItemCount = selectedIndex + 1;
  }
  const visibleSeries = series.slice(0, state.visibleItemCount);
  dom.resultList.innerHTML = visibleSeries.map((seriesEntity) => {
    const id = getSeriesId(seriesEntity);
    const key = getSeriesKey(seriesEntity);
    const pieces = getSeriesPieces(seriesEntity);
    const setCount = getSeriesGearSets(seriesEntity).length;
    const inWishlist = collectionHasAll(state.wishlistIds, key);
    const inFavorites = collectionHasAll(state.favoriteIds, key);
    return `
      <article class="gear-sets-result-card ${state.selectedSeries && getSeriesKey(state.selectedSeries) === key ? "is-selected" : ""}" data-series-engine="${escapeHtml(seriesEntity.engine)}" data-series-id="${escapeHtml(id)}">
        <button class="wishlist-button wishlist-button--card ${inWishlist ? "is-active" : ""}" type="button" data-wishlist-toggle data-item-id="${escapeHtml(key)}" aria-pressed="${inWishlist}" aria-label="加入愿望单"></button>
        <button class="favorite-button favorite-button--card ${inFavorites ? "is-active" : ""}" type="button" data-favorite-toggle data-item-id="${escapeHtml(key)}" aria-pressed="${inFavorites}" aria-label="加入收藏"></button>
        <img class="gear-sets-result-card__icon" src="${escapeHtml(getSeriesIcon(seriesEntity))}" alt="" />
        <div class="gear-sets-result-card__body">
          <div class="gear-sets-result-card__title-row">
            <h3 class="gear-sets-result-card__title">${escapeHtml(getSeriesName(seriesEntity))}</h3>
            <span class="gear-sets-result-card__id">#${escapeHtml(id)}</span>
          </div>
          <div class="gear-sets-result-card__meta">品级：${escapeHtml(seriesMaxNumber(seriesEntity, "maxItemLevel", "itemLevel"))} / 装备等级：${escapeHtml(seriesMaxNumber(seriesEntity, "maxEquipLevel", "equipLevel"))} / ${escapeHtml(pieces.length)} 件${setCount ? ` / ${escapeHtml(setCount)} 套` : ""}</div>
          <div class="gear-sets-result-card__source">来源：${escapeHtml(getSeriesSourceText(seriesEntity))}</div>
          <div class="gear-sets-result-card__tags">${renderSeriesCardStatusIcons(seriesEntity, { alwaysShowMarket: true })}</div>
        </div>
      </article>
    `;
  }).join("") + (state.visibleItemCount < series.length
    ? `<button class="result-load-more" type="button" data-load-more-results>加载更多（已显示 ${Math.min(state.visibleItemCount, series.length)} / 共 ${series.length} 条）</button>`
    : "");
}

function syncSelectedResultCard(options = {}) {
  if (!dom.resultList) return;
  const behavior = options.behavior || "smooth";
  let card = null;
  if (state.currentEngine === "gearSets" && state.selectedGearSet) {
    const key = getGearSetKey(state.selectedGearSet);
    card = Array.from(dom.resultList.querySelectorAll(".gear-sets-result-card[data-set-engine][data-set-id]"))
      .find((node) => getEntryKey(node.dataset.setEngine, node.dataset.setId) === key);
  } else if (isSeriesEngine(state.currentEngine) && state.selectedSeries) {
    const key = getSeriesKey(state.selectedSeries);
    card = Array.from(dom.resultList.querySelectorAll(".gear-sets-result-card[data-series-engine][data-series-id]"))
      .find((node) => getEntryKey(node.dataset.seriesEngine, node.dataset.seriesId) === key);
  } else if (state.currentEngine === "wishlist" && state.wishlistViewMode === "detail" && state.selectedWishlistKey) {
    card = Array.from(dom.resultList.querySelectorAll("[data-wishlist-select]"))
      .find((node) => node.dataset.wishlistSelect === state.selectedWishlistKey);
  } else if (isPieceEngine(state.currentEngine) && state.selectedItemId != null) {
    card = Array.from(dom.resultList.querySelectorAll("[data-item-id]"))
      .find((node) => {
        const item = getPieceById(node.dataset.itemId);
        return item && isSelectedResultItem(item);
      });
  }
  card?.scrollIntoView({ behavior, block: "center", inline: "nearest" });
}

function applyFiltersAndRender() {
  if (state.currentEngine === "wishlist" || state.currentEngine === "favorites") {
    if (state.currentEngine === "wishlist") renderWishlistList();
    else renderFavoritesList();
    syncSelectedResultCard({ behavior: "auto" });
    renderCurrentFilters();
    return;
  }
  if (state.currentEngine === "gearSets") {
    state.visibleItemCount = INITIAL_VISIBLE_RESULT_COUNT;
    state.filteredGearSets = sortGearSets(state.allGearSets.filter(gearSetMatchesFilters));
    if (!state.filteredGearSets.some((setEntity) => state.selectedGearSet && getGearSetKey(setEntity) === getGearSetKey(state.selectedGearSet))) {
      state.selectedGearSet = state.filteredGearSets[0] || state.allGearSets[0] || null;
    }
    renderGearSetResultCards();
    renderGearSetDetail();
    syncSelectedResultCard({ behavior: "auto" });
    renderCurrentFilters();
    return;
  }
  if (isSeriesEngine(state.currentEngine)) {
    state.visibleItemCount = INITIAL_VISIBLE_RESULT_COUNT;
    const source = state.currentEngine === "gearSeries" ? state.allGearSeries : state.allWeaponSeries;
    state.filteredSeries = sortSeries(source.filter(seriesMatchesFilters));
    if (!state.filteredSeries.some((seriesEntity) => state.selectedSeries && getSeriesKey(seriesEntity) === getSeriesKey(state.selectedSeries))) {
      state.selectedSeries = state.filteredSeries[0] || source[0] || null;
    }
    renderSeriesResultCards();
    renderSeriesDetail();
    syncSelectedResultCard({ behavior: "auto" });
    renderCurrentFilters();
    return;
  }
  state.visibleItemCount = INITIAL_VISIBLE_RESULT_COUNT;
  state.filteredItems = sortItems(state.allItems.filter(itemMatchesFilters));
  if (!state.filteredItems.some(isSelectedResultItem)) {
    const fallback = state.filteredItems[0] || state.allItems[0] || null;
    setSelectedItemId(fallback?.id ?? null);
  }
  renderResultCards();
  renderDetail();
  syncSelectedResultCard({ behavior: "auto" });
  renderCurrentFilters();
}

function renderCurrentFilters() {
  if (!dom.currentFilters) return;
  if (state.currentEngine === "wishlist") {
    dom.currentFilters.textContent = `当前筛选条件：愿望单 ${getResolvedWishlistItems().length} 条`;
  } else if (state.currentEngine === "favorites") {
    dom.currentFilters.textContent = `当前筛选条件：我的收藏 ${getResolvedFavoriteItems().length} 条`;
  } else if (state.currentEngine === "gearSets") {
    dom.currentFilters.textContent = `当前筛选条件：装备套装 ${Math.min(state.visibleItemCount, state.filteredGearSets.length)} / ${state.filteredGearSets.length} 条（总计 ${state.allGearSets.length} 条）`;
  } else if (isSeriesEngine(state.currentEngine)) {
    const source = state.currentEngine === "gearSeries" ? state.allGearSeries : state.allWeaponSeries;
    dom.currentFilters.textContent = `当前筛选条件：${ENGINE_LABELS[state.currentEngine]} ${Math.min(state.visibleItemCount, state.filteredSeries.length)} / ${state.filteredSeries.length} 条（总计 ${source.length} 条）`;
  } else if (state.currentEngine === "accessoryPieces") {
    const modeText = state.accessoryViewMode === "group" ? "同模整合" : "散件";
    dom.currentFilters.textContent = `当前筛选条件：饰品散件（${modeText}）${Math.min(state.visibleItemCount, state.filteredItems.length)} / ${state.filteredItems.length} 条（总计 ${state.allItems.length} 条）`;
  } else {
    dom.currentFilters.textContent = `当前筛选条件：${getPieceLabel()} ${Math.min(state.visibleItemCount, state.filteredItems.length)} / ${state.filteredItems.length} 条（总计 ${state.allItems.length} 条）`;
  }
}

function getAvailableDyeModes(item) {
  if (!item?.canDye) return ["original"];
  if (!item.canDualDye) return ["original", "dye1"];
  return ["original", "dye1", "dye2", "dyeDouble"];
}

function syncDyeTabs() {
  const item = getItemById(state.previewItemId) || getItemById(state.selectedItemId);
  const modes = getAvailableDyeModes(item);
  if (!modes.includes(state.dye)) state.dye = "original";
  dom.dyeTabs.forEach((tab) => {
    const enabled = modes.includes(tab.dataset.dye);
    tab.disabled = !enabled;
    tab.classList.toggle("is-disabled", !enabled);
    tab.classList.toggle("is-active", enabled && tab.dataset.dye === state.dye);
  });
}

function syncGenderTabs() {
  const item = getItemById(state.previewItemId) || getItemById(state.selectedItemId);
  const availableGenders = getAvailablePreviewGenders(item);
  const shouldHide = state.currentEngine === "accessoryPieces" || state.currentEngine === "weaponPieces" || availableGenders.length <= 1;
  dom.genderTabs.forEach((tab) => {
    const enabled = !shouldHide && availableGenders.includes(tab.dataset.gender);
    const isActive = tab.dataset.gender === state.gender;
    if (tab.parentElement?.classList.contains("gender-tabs")) {
      tab.parentElement.hidden = shouldHide;
    }
    tab.disabled = !enabled;
    tab.classList.toggle("is-disabled", !enabled && !shouldHide);
    tab.classList.toggle("is-active", enabled && isActive);
    tab.setAttribute("aria-pressed", enabled && isActive ? "true" : "false");
  });
}

function syncPreviewImage() {
  const selected = getItemById(state.selectedItemId);
  const item = getItemById(state.previewItemId) || selected;
  ensurePreviewGender(item);
  syncGenderTabs();
  if (!item || !dom.previewImage) return;
  const imagePath = getPreviewImagePath(item);
  dom.previewImage.classList.toggle("is-empty", !imagePath);
  if (imagePath) dom.previewImage.src = imagePath;
  else dom.previewImage.removeAttribute("src");
  dom.previewImage.alt = `${item.name} 预览`;
  dom.previewTitle.textContent = String(item.id) === String(selected?.id) ? item.name : `${item.name}（同模预览）`;
}

function renderSetPanel(item) {
  syncRacePreviewPanel(item);
  const heading = dom.setPanelTitle?.closest("section")?.querySelector("h3");
  if (isAccessoryGroupView() && getAccessoryGroupMembers(item).length > 1) {
    const members = getAccessoryGroupMembers(item);
    if (heading) heading.textContent = "饰品分组";
    dom.setPanelTitle.textContent = item.accessorygroupId || "未分组饰品";
    dom.setPanelList.innerHTML = `
      <li>同模饰品：${escapeHtml(members.length)} 件</li>
      <li>代表图标：#${escapeHtml(Math.min(...members.map((member) => Number(member.id))))}</li>
    `;
    return;
  }
  if (heading) heading.textContent = state.currentEngine === "weaponPieces" ? "武器系列" : "所属套装";
  if (state.currentEngine === "weaponPieces") {
    const seriesEntity = state.allWeaponSeries.find((series) =>
      getSeriesPieces(series).some((piece) => String(piece.id) === String(item.id))
    );
    if (!seriesEntity) {
      dom.setPanelTitle.textContent = "暂无武器系列信息";
      dom.setPanelList.innerHTML = `<li class="set-piece-empty">当前数据中没有可展示的武器系列。</li>`;
      return;
    }
    dom.setPanelTitle.innerHTML = `
      <span class="set-panel-title-main">
        <button class="set-panel-title-link" type="button" data-navigate-series-engine="${escapeHtml(seriesEntity.engine)}" data-navigate-series-id="${escapeHtml(getSeriesId(seriesEntity))}">${escapeHtml(getSeriesName(seriesEntity))}</button>
      </span>
    `;
    dom.setPanelList.innerHTML = sortWeaponSeriesPiecesForDisplay(getSeriesPieces(seriesEntity)).map((piece) => `
      <li class="set-piece-row ${String(piece.id) === String(item.id) ? "is-current" : ""}">
        <button class="set-piece-link" type="button" data-navigate-item-id="${escapeHtml(piece.id)}">${escapeHtml(piece.name)}</button>
        <button class="set-piece-preview-link" type="button" data-preview-item-id="${escapeHtml(piece.id)}">预览</button>
      </li>
    `).join("");
    return;
  }
  const setIds = Array.isArray(item.setIds) ? item.setIds.map(String) : [];
  const customIds = Array.isArray(item.customSetIds) ? item.customSetIds : [];
  const setEntity = state.allGearSets.find((set) =>
    set.engine === "gearSets" ? setIds.includes(String(getGearSetId(set))) : customIds.includes(getGearSetId(set))
  );
  if (!setEntity) {
    dom.setPanelTitle.textContent = "暂无套装信息";
    dom.setPanelList.innerHTML = `<li class="set-piece-empty">当前数据中没有可展示的套装。</li>`;
    return;
  }
  const setType = setEntity.engine === "gearSets" ? "官方" : "自定义";
  dom.setPanelTitle.innerHTML = `
    <span class="set-panel-title-main">
      <button class="set-panel-title-link" type="button" data-navigate-set-engine="${escapeHtml(setEntity.engine)}" data-navigate-set-id="${escapeHtml(getGearSetId(setEntity))}">${escapeHtml(getGearSetName(setEntity))}</button>
      <span class="set-panel-type-tag set-panel-type-tag--${setEntity.engine === "gearSets" ? "official" : "custom"}">${setType}</span>
    </span>
    <button class="set-piece-preview-link" type="button" data-preview-item-id="${escapeHtml(item.id)}">预览</button>
  `;
  dom.setPanelList.innerHTML = getGearSetPieces(setEntity).map((piece) => `
    <li class="set-piece-row ${String(piece.id) === String(item.id) ? "is-current" : ""}">
      <button class="set-piece-link" type="button" data-navigate-item-id="${escapeHtml(piece.id)}">${escapeHtml(piece.name)}</button>
      <button class="set-piece-preview-link" type="button" data-preview-item-id="${escapeHtml(piece.id)}">预览</button>
    </li>
  `).join("");
}

function getSameModelItems(item) {
  const accessoryMembers = isAccessoryGroupView() ? getAccessoryGroupMembers(item) : [];
  const ids = new Set([String(item.id), ...(Array.isArray(item.sharedModels) ? item.sharedModels.map(String) : [])]);
  accessoryMembers.forEach((member) => ids.add(String(member.id)));
  const candidates = getSameModelCandidateItems(item).filter((candidate) => ids.has(String(candidate.id)));
  const byId = new Map([...accessoryMembers, ...candidates].map((candidate) => [String(candidate.id), candidate]));
  return Array.from(byId.values()).sort((a, b) => String(a.id) === String(item.id) ? -1 : String(b.id) === String(item.id) ? 1 : Number(a.id) - Number(b.id));
}

function isReplicaItem(item) {
  return String(item?.name || "").includes("复制品");
}

function getSameModelRecommendationScore(item) {
  let score = 0;
  if (item.canArmoire) score += 10000;
  if (item.canDualDye) score += 1000;
  else if (item.canDye) score += 500;
  if (item.canDresserSet || item.canDresser) score += 100;
  if (item.canCrest) score += 10;
  return score;
}

function getGearRoleToken(item) {
  const name = String(item?.name || "");
  return ["御敌", "制敌", "强袭", "精准", "强弓", "游击", "治愈", "咏咒", "巧匠", "大地"].find((token) => name.includes(token)) || "";
}

function sortSameModelRecommendationItems(items, currentItem = null) {
  const currentRoleToken = getGearRoleToken(currentItem);
  return [...items].sort((a, b) => {
    const replicaDiff = Number(isReplicaItem(a)) - Number(isReplicaItem(b));
    if (replicaDiff !== 0) return replicaDiff;
    const scoreDiff = getSameModelRecommendationScore(b) - getSameModelRecommendationScore(a);
    if (scoreDiff !== 0) return scoreDiff;
    if (currentRoleToken) {
      const roleDiff = Number(getGearRoleToken(b) === currentRoleToken) - Number(getGearRoleToken(a) === currentRoleToken);
      if (roleDiff !== 0) return roleDiff;
    }
    const idDiff = Number(b.id || 0) - Number(a.id || 0);
    if (idDiff !== 0) return idDiff;
    const itemLevelDiff = Number(b.itemLevel || 0) - Number(a.itemLevel || 0);
    if (itemLevelDiff !== 0) return itemLevelDiff;
    const equipLevelDiff = Number(b.equipLevel || 0) - Number(a.equipLevel || 0);
    if (equipLevelDiff !== 0) return equipLevelDiff;
    return String(a.name || "").localeCompare(String(b.name || ""), "zh-Hans-CN");
  });
}

function getSameModelRecommendationCandidates(item) {
  if (!item) return [];
  const ids = new Set([String(item.id), ...(Array.isArray(item.sharedModels) ? item.sharedModels.map(String) : [])]);
  if (item.slotCategory === "饰品") {
    getAccessoryGroupMembers(item).forEach((member) => ids.add(String(member.id)));
  }
  const candidates = getSameModelCandidateItems(item)
    .filter((candidate) => ids.has(String(candidate.id)) && !candidate.sameModelOnly);
  const byId = new Map(candidates.map((candidate) => [String(candidate.id), candidate]));
  return Array.from(byId.values());
}

function getRecommendedPieceForWishlist(item) {
  const candidates = getSameModelRecommendationCandidates(item);
  if (candidates.length <= 1) return null;
  const best = sortSameModelRecommendationItems(candidates, item)[0];
  if (!best || String(best.id) === String(item.id)) return null;
  if (getSameModelRecommendationScore(best) <= getSameModelRecommendationScore(item)) return null;
  return best;
}

function getGearSetRecommendationScore(setEntity) {
  let score = 0;
  if (gearSetPiecesHaveAny(setEntity, "canArmoire")) score += 10000;
  if (gearSetCanDualDyeForPreview(setEntity)) score += 1000;
  else if (gearSetCanDyeForPreview(setEntity)) score += 500;
  if (gearSetPiecesHaveAny(setEntity, "canDresserSet")) score += 100;
  if (gearSetPiecesHaveAny(setEntity, "canCrest")) score += 10;
  return score;
}

function sortRecommendedGearSetEntities(setEntities) {
  return [...setEntities].sort((a, b) => {
    const replicaDiff = Number(isReplicaItem(a?.data)) - Number(isReplicaItem(b?.data));
    if (replicaDiff !== 0) return replicaDiff;
    const scoreDiff = getGearSetRecommendationScore(b) - getGearSetRecommendationScore(a);
    if (scoreDiff !== 0) return scoreDiff;
    const itemLevelDiff = gearSetMaxNumber(b, "ilvl", "itemLevel") - gearSetMaxNumber(a, "ilvl", "itemLevel");
    if (itemLevelDiff !== 0) return itemLevelDiff;
    const equipLevelDiff = gearSetMaxNumber(b, "elvl", "equipLevel") - gearSetMaxNumber(a, "elvl", "equipLevel");
    if (equipLevelDiff !== 0) return equipLevelDiff;
    return getGearSetName(a).localeCompare(getGearSetName(b), "zh-Hans-CN");
  });
}

function getRecommendedGearSetForWishlist(setEntity) {
  if (!setEntity) return null;
  const candidates = [setEntity, ...getSimilarGearSets(setEntity)];
  if (candidates.length <= 1) return null;
  const best = sortRecommendedGearSetEntities(candidates)[0];
  if (!best || getGearSetKey(best) === getGearSetKey(setEntity)) return null;
  if (getGearSetRecommendationScore(best) <= getGearSetRecommendationScore(setEntity)) return null;
  return best;
}

function getWishlistRecommendationForKey(key) {
  const { engine, id } = parseEntryKey(key);
  if (engine === "gearPieces" || engine === "accessoryPieces" || engine === "weaponPieces") {
    const item = engine === "weaponPieces" ? state.weaponPiecesById.get(String(id)) : state.gearPiecesById.get(String(id));
    const recommended = getRecommendedPieceForWishlist(item);
    return recommended ? getEntryKey(getItemEngine(recommended), recommended.id) : "";
  }
  if (engine === "gearSets" || engine === "customGearSets") {
    const setEntity = getGearSetByKey(getEntryKey(engine, id));
    const recommended = getRecommendedGearSetForWishlist(setEntity);
    return recommended ? getGearSetKey(recommended) : "";
  }
  return "";
}

function renderDyeTag(item) {
  if (item.canDualDye) return `<span class="model-tag is-dye">双染</span>`;
  if (item.canDye) return `<span class="model-tag is-dye">单染</span>`;
  return `<span class="model-tag is-muted">不可染</span>`;
}

function sourceFieldMatches(fields, ids) {
  return ids.some((id) => fields.categories.includes(id) || fields.groups.includes(id) || fields.subCategories.includes(id));
}

function getSameModelSourceIcon(item) {
  const fields = getSourceFieldValues(item);
  const sourceText = getSourceText(item);
  const sourceGroupText = getSourceGroupLabel(item);
  const acquisitionText = getAcquisitionText(item);
  const sourceMatchText = [sourceText, sourceGroupText, acquisitionText].join(" / ");
  if (sourceFieldMatches(fields, ["craftRecipe", "combatCraft", "masterRecipeCombat", "fashionCraft", "crafting"]) || /制作|能工巧匠|配方/.test(sourceMatchText)) {
    return {
      src: "images/ui/source-icons/crafting.png",
      label: "制作",
    };
  }
  if (sourceFieldMatches(fields, ["deepDungeon", "palaceOfTheDead", "heavenOnHigh", "eurekaOrthos", "pilgrimTraverse"]) || /深层迷宫|死者宫殿|天之御柱|正统优雷卡|朝圣交错路/.test(sourceMatchText)) {
    return {
      src: "images/ui/source-icons/deep-dungeon.png",
      label: "深层迷宫",
    };
  }
  if (sourceFieldMatches(fields, ["ultimate"]) || /绝境战/.test(sourceMatchText)) {
    return {
      src: "images/ui/source-icons/ultimate.png",
      label: "绝境战",
    };
  }
  if (sourceFieldMatches(fields, ["trial", "unrealTrial"]) || /讨伐歼灭战|讨伐|歼灭|幻巧战/.test(sourceMatchText)) {
    return {
      src: "images/ui/source-icons/trial.png",
      label: "讨伐歼灭战",
    };
  }
  if (sourceFieldMatches(fields, ["huntCurrency", "monsterHunt"]) || /狩猎|兵团徽章|怪物狩猎/.test(sourceMatchText)) {
    return {
      src: "images/ui/source-icons/hunt.png",
      label: "狩猎",
    };
  }
  if (sourceFieldMatches(fields, ["战利水晶兑换", "trophyCrystal"]) || /战利水晶/.test(sourceMatchText)) {
    return {
      src: "images/ui/source-icons/trophy-crystal.png",
      label: "战利水晶兑换",
    };
  }
  if (sourceFieldMatches(fields, ["treasureHunt"]) || /寻宝|宝物库|藏宝图/.test(sourceMatchText)) {
    return {
      src: "images/ui/source-icons/treasure-hunt.png",
      label: "寻宝",
    };
  }
  if (sourceFieldMatches(fields, ["goldSaucer"]) || /金碟|金碟游乐场|金碟币/.test(sourceMatchText)) {
    return {
      src: "images/ui/source-icons/gold-saucer.png",
      label: "金碟游乐场",
    };
  }
  if (sourceFieldMatches(fields, ["alliedSociety", "beastTribe", "tribalQuest", "tribalCurrency"]) || /友好部族|蛮族/.test(sourceMatchText)) {
    return {
      src: "images/ui/source-icons/tribal-quest.png",
      label: "友好部族",
    };
  }
  if (sourceFieldMatches(fields, ["wondrousTails", "weeklyBingo"]) || /天书奇谈|天书/.test(sourceMatchText)) {
    return {
      src: "images/ui/source-icons/wondrous-tails.png",
      label: "天书奇谈",
    };
  }
  if (sourceFieldMatches(fields, ["grandCompanySeal", "companySeal"]) || /军票|大国防联军/.test(sourceMatchText)) {
    return {
      src: "images/ui/source-icons/grand-company-seal.png",
      label: "军票",
    };
  }
  if (sourceFieldMatches(fields, ["customDelivery"]) || /老主顾/.test(sourceMatchText)) {
    return {
      src: "images/ui/source-icons/custom-delivery.png",
      label: "老主顾",
    };
  }
  if (sourceFieldMatches(fields, ["variantCriterion"]) || /多变迷宫|异闻/.test(sourceMatchText)) {
    return {
      src: "images/ui/source-icons/variant-criterion.png",
      label: "多变迷宫",
    };
  }
  if (sourceFieldMatches(fields, ["crescentIsle"]) || /新月岛|蜃景幻界/.test(sourceMatchText)) {
    return {
      src: "images/ui/source-icons/crescent-isle.png",
      label: "新月岛",
    };
  }
  if (sourceFieldMatches(fields, ["cosmicExploration"]) || /宇宙探索/.test(sourceMatchText)) {
    return {
      src: "images/ui/source-icons/cosmic-exploration.png",
      label: "宇宙探索",
    };
  }
  if (sourceFieldMatches(fields, ["dungeon"]) || /迷宫挑战|四人本/.test(sourceMatchText)) {
    return {
      src: "images/ui/source-icons/dungeon-4.png",
      label: "迷宫挑战（四人本）",
    };
  }
  if (sourceFieldMatches(fields, ["raid", "chaoticAllianceRaid"]) || /大型任务|诛灭战/.test(sourceMatchText)) {
    return {
      src: "images/ui/source-icons/raid-8.png",
      label: "大型任务",
    };
  }
  if (sourceFieldMatches(fields, ["allianceRaid"]) || /团队任务/.test(sourceMatchText)) {
    return {
      src: "images/ui/source-icons/alliance-raid-24.png",
      label: "团队任务",
    };
  }
  return null;
}

function renderSameModelSourceCell(item) {
  if (item.sameModelOnly) {
    return `
      <span class="model-source-cell" title="${escapeHtml(item.banReason || "详见 WIKI")}">
        <span>详见 WIKI</span>
      </span>
    `;
  }
  const icon = getSameModelSourceIcon(item);
  const text = getSourceGroupLabel(item);
  return `
    <span class="model-source-cell" title="${escapeHtml(text)}">
      ${icon
        ? `<img class="model-source-icon" src="${escapeHtml(icon.src)}" alt="${escapeHtml(icon.label)}" title="${escapeHtml(icon.label)}" />`
        : `<span>${escapeHtml(text)}</span>`}
    </span>
  `;
}

function renderSeriesSourceIconCell(seriesEntity) {
  const pieces = getSeriesPieces(seriesEntity);
  const representative = pieces.find((piece) => getSameModelSourceIcon(piece)) || pieces[0] || {};
  const sourceItem = {
    ...representative,
    sourceFilterCategory: representative.sourceFilterCategory || seriesEntity?.data?.sourceCategory,
    sourceFilterGroup: representative.sourceFilterGroup || seriesEntity?.data?.sourceSubCategory,
    sourceFilterSubCategory: representative.sourceFilterSubCategory || representative.sourceSubCategory || seriesEntity?.data?.sourceSubCategory,
  };
  return renderSameModelSourceCell(sourceItem);
}

function renderSameModelRows(item) {
  return getSameModelItems(item).map((other) => `
    <tr class="${String(other.id) === String(state.previewItemId) ? "is-current" : ""} ${other.sameModelOnly ? "is-same-model-only" : ""}">
      <td><div class="model-name-cell">
        <img ${renderIconImageAttrs(other)} />
        ${other.sameModelOnly
          ? `<span class="model-name-link model-name-link--static" title="因为有完全同模装备且更易获取装备，所以不做收录">${escapeHtml(other.name)}</span>`
          : `<button class="model-name-link" type="button" data-navigate-item-id="${escapeHtml(other.id)}">${escapeHtml(other.name)}</button>`}
        ${other.sameModelOnly ? "" : `<button class="model-preview-link" type="button" data-preview-item-id="${escapeHtml(other.id)}">预览</button>`}
      </div></td>
      <td>${escapeHtml(other.itemLevel)}</td>
      <td>${escapeHtml(other.equipLevel)}</td>
      <td>${renderSameModelSourceCell(other)}</td>
      <td><div class="model-tags">
        ${state.currentEngine === "accessoryPieces" ? "" : renderDyeTag(other)}
        ${state.currentEngine === "weaponPieces"
          ? `<img class="model-status-icon" src="images/ui/item-detail-icons/${other.canDresser ? "icon-r2-c2" : "icon-r1-c2"}.png" alt="" title="${other.canDresser ? "可加入投影台" : "不可加入投影台"}" />`
          : `<img class="model-status-icon" src="images/ui/item-detail-icons/${other.canDresserSet ? "dresser-set-on" : "dresser-set-off"}.png" alt="" title="${other.canDresserSet ? "可成套加入投影台" : "不可成套加入投影台"}" />`}
        <img class="model-status-icon" src="images/ui/item-detail-icons/${other.canArmoire ? "armoire-on" : "armoire-off"}.png" alt="" title="${other.canArmoire ? "可加入收藏柜" : "不可加入收藏柜"}" />
        ${state.currentEngine === "accessoryPieces" ? "" : `<img class="model-status-icon" src="images/ui/item-detail-icons/${other.canCrest ? "crest-on" : "crest-off"}.png" alt="" title="${other.canCrest ? "可添加部队徽记" : "不可添加部队徽记"}" />`}
      </div></td>
    </tr>
  `).join("");
}

function renderAcquisitionRows(item) {
  const acquisitionEntries = getAcquisitionEntries(item);
  if (acquisitionEntries.length === 0) return `<tr><td>${escapeHtml(getAcquisitionText(item))}</td><td>详情待接入</td><td></td></tr>`;
  return acquisitionEntries.slice(0, 80).map((entry) => `
    <tr>
      <td>${escapeHtml(entry.type || entry.subType || "获取方式")}</td>
      <td>${renderAcquisitionDetailCell(entry)}</td>
      <td>${escapeHtml(getAcquisitionTokenText(entry))}</td>
    </tr>
  `).join("");
}

function renderDetail() {
  const item = getItemById(state.selectedItemId);
  if (!item) return;
  if (!getItemById(state.previewItemId)) setPreviewItemId(item.id);
  dom.detailItemIcon.src = getIconUrl(item);
  const detailIconFallback = getItemIconFallbackUrl(item);
  if (detailIconFallback) dom.detailItemIcon.dataset.iconFallback = detailIconFallback;
  else delete dom.detailItemIcon.dataset.iconFallback;
  delete dom.detailItemIcon.dataset.iconFallbackTried;
  const slotLabel = state.currentEngine === "weaponPieces" ? "武器类型" : "装备栏位";
  const slotText = state.currentEngine === "weaponPieces" ? item.weaponType || item.weaponSlot || "-" : item.equipSlot || "-";
  const accessoryGroupInfo = isAccessoryGroupView() && item.accessorygroupId && getAccessoryGroupMembers(item).length > 1
    ? `<span>饰品分组：<strong>${escapeHtml(item.accessorygroupId)}</strong></span>`
    : "";
  dom.basicInfoGrid.innerHTML = `
    <span>品级：<strong>${escapeHtml(item.itemLevel)}</strong></span>
    <span>装备等级：<strong>${escapeHtml(item.equipLevel)}</strong></span>
    <span>${slotLabel}：<strong>${escapeHtml(slotText)}</strong></span>
    <span>加入版本：<strong>${escapeHtml(getItemPatch(item) || "-")}</strong></span>
    ${accessoryGroupInfo}
  `;
  dom.detailTagRow.innerHTML = renderStatusTags(item, "detail");
  renderSetPanel(item);
  dom.sameModelTableBody.innerHTML = renderSameModelRows(item);
  dom.acquisitionTableBody.innerHTML = renderAcquisitionRows(item);
  syncDyeTabs();
  syncPreviewImage();
  syncActionButtons();
}

function getAvailableGearSetDyeModes(setEntity) {
  if (state.previewGearSetPieceId) {
    const piece = getGearPieceById(state.previewGearSetPieceId);
    return getAvailableDyeModes(piece);
  }
  if (!gearSetCanDyeForPreview(setEntity)) return ["original"];
  if (!gearSetCanDualDyeForPreview(setEntity)) return ["original", "dye1"];
  return ["original", "dye1", "dye2", "dyeDouble"];
}

function getAvailableSeriesDyeModes(seriesEntity) {
  const pieces = getSeriesPieces(seriesEntity);
  if (!pieces.some((piece) => piece.canDye)) return ["original"];
  if (!pieces.some((piece) => piece.canDualDye)) return ["original", "dye1"];
  return ["original", "dye1", "dye2", "dyeDouble"];
}

function renderSetDyeTabs(modes) {
  return `
    <div class="dye-tabs">
      ${[
        ["original", "原色"],
        ["dye1", "区域1"],
        ["dye2", "区域2"],
        ["dyeDouble", "双染"],
      ].map(([mode, label]) => `<button class="switch-tab ${state.dye === mode ? "is-active" : ""} ${modes.includes(mode) ? "" : "is-disabled"}" type="button" data-set-dye="${mode}" ${modes.includes(mode) ? "" : "disabled"}>${label}</button>`).join("")}
    </div>
  `;
}

function renderGearSetPreviewBlock(setEntity) {
  const previewPiece = state.previewGearSetPieceId ? getGearPieceById(state.previewGearSetPieceId) : null;
  const previewSet = state.previewGearSetKey ? getGearSetByKey(state.previewGearSetKey) || setEntity : setEntity;
  const genders = getAvailableGearSetPreviewGenders(previewSet);
  applyImageGenderPreferenceForGenders(genders);
  const showGenderTabs = genders.length > 1;
  const imagePaths = previewPiece ? [getPreviewImagePath(previewPiece)] : getGearSetPreviewImageCandidates(previewSet);
  const name = previewPiece?.name || getGearSetName(previewSet);
  const imageAttrs = renderPreviewImageAttrs(imagePaths, "gear-sets-preview-image", `${name} 预览`);
  return `
    <div class="gear-sets-preview-stage">
      ${imageAttrs ? `<img ${imageAttrs} />` : `<div class="gear-sets-preview-empty"></div>`}
      <h2 class="gear-sets-preview-title">${escapeHtml(name)}</h2>
      <div class="gear-sets-gender-tabs" ${showGenderTabs ? "" : "hidden"}>
        <button class="compact-tab ${state.gender === "male" ? "is-active" : ""}" type="button" data-set-gender="male" ${genders.includes("male") ? "" : "disabled"}>男</button>
        <button class="compact-tab ${state.gender === "female" ? "is-active" : ""}" type="button" data-set-gender="female" ${genders.includes("female") ? "" : "disabled"}>女</button>
      </div>
    </div>
  `;
}

function renderGearSetPieceTextList(setEntity) {
  const pieces = getGearSetPieces(setEntity);
  return pieces.length ? pieces.map((piece) => `
    <li class="gear-sets-piece-row">
      <button class="set-piece-link" type="button" data-navigate-item-id="${escapeHtml(piece.id)}">${escapeHtml(piece.name)}</button>
      <button class="set-piece-preview-link" type="button" data-set-preview-item-id="${escapeHtml(piece.id)}">预览</button>
    </li>
  `).join("") : `<li class="set-piece-empty">暂无散件数据。</li>`;
}

function renderGearSetSimilarRows(setEntity) {
  const sets = getSimilarGearSets(setEntity);
  if (!sets.length) return `<tr><td colspan="5"><span class="gear-sets-empty">暂无三件以上同模的相似套装。</span></td></tr>`;
  return sets.slice(0, 30).map((similarSet) => {
    const key = getGearSetKey(similarSet);
    return `
      <tr class="${state.previewGearSetKey === key ? "is-current" : ""}">
        <td><div class="model-name-cell">
          <img src="${escapeHtml(getGearSetIcon(similarSet))}" alt="" />
          <button class="model-name-link" type="button" data-navigate-set-engine="${escapeHtml(similarSet.engine)}" data-navigate-set-id="${escapeHtml(getGearSetId(similarSet))}">${escapeHtml(getGearSetName(similarSet))}</button>
          <button class="model-preview-link" type="button" data-preview-set-key="${escapeHtml(key)}">预览</button>
        </div></td>
        <td>${escapeHtml(gearSetMaxNumber(similarSet, "ilvl", "itemLevel"))}</td>
        <td>${escapeHtml(gearSetMaxNumber(similarSet, "elvl", "equipLevel"))}</td>
        <td>${escapeHtml(getGearSetAcquisitionText(similarSet))}</td>
        <td><div class="model-tags"><span class="model-tag is-dresser">同模 ${escapeHtml(countMatchingArmorModelSlots(setEntity, similarSet))} 件</span></div></td>
      </tr>
    `;
  }).join("");
}

function renderGearSetAcquisitionRows(setEntity) {
  return `
    <tr>
      <td>${escapeHtml(getGearSetSourceText(setEntity))}</td>
      <td>${escapeHtml(getGearSetAcquisitionText(setEntity))}</td>
      <td>套装页不展开散件获取明细</td>
    </tr>
  `;
}

function renderSeriesMemberList(seriesEntity) {
  const sets = getSeriesGearSets(seriesEntity);
  if (seriesEntity.engine === "gearSeries") {
    return sets.length ? sets.map((setEntity) => `
      <li class="gear-sets-piece-row">
        <button class="set-piece-link" type="button" data-navigate-set-engine="${escapeHtml(setEntity.engine)}" data-navigate-set-id="${escapeHtml(getGearSetId(setEntity))}">${escapeHtml(getGearSetName(setEntity))}</button>
        <span class="gear-sets-empty">${escapeHtml(getGearSetPieces(setEntity).length)} 件</span>
      </li>
    `).join("") : `<li class="set-piece-empty">${escapeHtml(seriesEntity.data?.note || "暂无套装归属。")}</li>`;
  }
  const pieces = sortWeaponSeriesPiecesForDisplay(getSeriesPieces(seriesEntity));
  return pieces.length ? pieces.map((piece) => `
    <li class="gear-sets-piece-row">
      <button class="set-piece-link" type="button" data-navigate-item-id="${escapeHtml(piece.id)}">${escapeHtml(piece.name)}</button>
      <span class="gear-sets-empty">${escapeHtml(piece.weaponType || piece.weaponSlot || "武器")}</span>
    </li>
  `).join("") : `<li class="set-piece-empty">${escapeHtml(seriesEntity.data?.note || "暂无武器归属。")}</li>`;
}

function renderSimilarSeriesRows(seriesEntity) {
  const series = getSimilarSeries(seriesEntity);
  const isGearSeries = seriesEntity.engine === "gearSeries";
  if (!series.length) {
    return `<tr><td colspan="5"><span class="gear-sets-empty">暂无过半${isGearSeries ? "套装" : "武器"}同模的相似系列。</span></td></tr>`;
  }
  return series.slice(0, 30).map((similarSeries) => {
    return `
      <tr>
        <td><div class="model-name-cell">
          <img src="${escapeHtml(getSeriesIcon(similarSeries))}" alt="" />
          <button class="model-name-link" type="button" data-navigate-series-engine="${escapeHtml(similarSeries.engine)}" data-navigate-series-id="${escapeHtml(getSeriesId(similarSeries))}">${escapeHtml(getSeriesName(similarSeries))}</button>
        </div></td>
        <td>${escapeHtml(seriesMaxNumber(similarSeries, "maxItemLevel", "itemLevel"))}</td>
        <td>${escapeHtml(seriesMaxNumber(similarSeries, "maxEquipLevel", "equipLevel"))}</td>
        <td>${renderSeriesSourceIconCell(similarSeries)}</td>
        <td><div class="model-tags">${renderSeriesCoreStatusIcons(similarSeries)}</div></td>
      </tr>
    `;
  }).join("");
}

function renderGearSetDetail() {
  if (!dom.gearSetsDetailView) return;
  const setEntity = state.selectedGearSet;
  if (!setEntity) {
    dom.gearSetsDetailView.innerHTML = `<div class="gear-sets-empty">请选择一个套装。</div>`;
    return;
  }
  const modes = getAvailableGearSetDyeModes(setEntity);
  if (!modes.includes(state.dye)) state.dye = "original";
  const pieces = getGearSetPieces(setEntity);
  const setKey = getGearSetKey(setEntity);
  const inWishlist = collectionHasAll(state.wishlistIds, setKey);
  const inFavorites = collectionHasAll(state.favoriteIds, setKey);
  dom.gearSetsDetailView.innerHTML = `
    <div class="gear-sets-detail-shell">
      <div class="gear-sets-top">
        <section class="gear-sets-preview-column">
          ${renderGearSetPreviewBlock(setEntity)}
          ${renderSetDyeTabs(modes)}
        </section>
        <section class="gear-sets-info-area">
          <section class="gear-sets-basic-info">
            <div class="gear-sets-title-row">
              <img class="gear-sets-detail-icon" src="${escapeHtml(getGearSetIcon(setEntity))}" alt="" />
              <div class="gear-sets-summary-main">
                <div class="gear-sets-info-grid">
                  <span>品级：<strong>${escapeHtml(gearSetMaxNumber(setEntity, "ilvl", "itemLevel"))}</strong></span>
                  <span>装备等级：<strong>${escapeHtml(gearSetMaxNumber(setEntity, "elvl", "equipLevel"))}</strong></span>
                  <span>件数：<strong>${escapeHtml(pieces.length)}</strong></span>
                  <span>加入版本：<strong>${escapeHtml(getGearSetPatch(setEntity) || "-")}</strong></span>
                </div>
                <div class="tag-row">${renderGearSetCardStatusIcons(setEntity)}</div>
              </div>
              <div class="gear-sets-actions">
                <button class="wishlist-button ${inWishlist ? "is-active" : ""}" type="button" data-wishlist-toggle data-item-id="${escapeHtml(setKey)}" aria-pressed="${inWishlist}" aria-label="加入愿望单"></button>
                <button class="favorite-button ${inFavorites ? "is-active" : ""}" type="button" data-favorite-toggle data-item-id="${escapeHtml(setKey)}" aria-pressed="${inFavorites}" aria-label="加入收藏"></button>
              </div>
            </div>
          </section>
          <div class="gear-sets-relation-regions">
            <section class="gear-sets-relation-region"><h3>套装散件</h3><p>${escapeHtml(getGearSetName(setEntity))}</p><ul class="gear-sets-piece-list">${renderGearSetPieceTextList(setEntity)}</ul></section>
            <section class="gear-sets-relation-region"><h3>相似套装</h3><div class="gear-sets-model-table-wrap"><table class="model-table"><thead><tr><th>名称</th><th>品级</th><th>等级</th><th>获取方式</th><th>标签</th></tr></thead><tbody>${renderGearSetSimilarRows(setEntity)}</tbody></table></div></section>
          </div>
        </section>
      </div>
      <section class="gear-sets-acquisition-region acquisition-region"><div class="acquisition-table-wrap"><table class="acquisition-table"><thead><tr><th>获取方式</th><th>获取地点 / NPC / 内容</th><th>消耗</th></tr></thead><tbody>${renderGearSetAcquisitionRows(setEntity)}</tbody></table></div></section>
    </div>
  `;
  syncActionButtons();
}

function renderWeaponSeriesDetail(seriesEntity) {
  const key = getSeriesKey(seriesEntity);
  const pieces = getSeriesPieces(seriesEntity);
  const modes = getAvailableSeriesDyeModes(seriesEntity);
  if (!modes.includes(state.dye)) state.dye = "original";
  const genders = getAvailableSeriesPreviewGenders(seriesEntity);
  applyImageGenderPreferenceForGenders(genders);
  const showGenderTabs = genders.length > 1;
  const previewPaths = getSeriesPreviewImageCandidates(seriesEntity);
  const previewAttrs = renderPreviewImageAttrs(previewPaths, "gear-sets-preview-image", `${getSeriesName(seriesEntity)} 预览`);
  const inWishlist = collectionHasAll(state.wishlistIds, key);
  const inFavorites = collectionHasAll(state.favoriteIds, key);
  dom.gearSetsDetailView.innerHTML = `
    <div class="gear-sets-detail-shell gear-sets-detail-shell--weapon-series">
      <div class="gear-sets-weapon-series-layout">
        <section class="gear-sets-preview-column gear-sets-weapon-series-preview">
          <div class="gear-sets-preview-stage">
            ${previewAttrs ? `<img ${previewAttrs} />` : `<div class="gear-sets-preview-empty"></div>`}
            <h2 class="gear-sets-preview-title">${escapeHtml(getSeriesName(seriesEntity))}</h2>
            <div class="gear-sets-gender-tabs" ${showGenderTabs ? "" : "hidden"}>
              <button class="compact-tab ${state.gender === "male" ? "is-active" : ""}" type="button" data-set-gender="male" ${genders.includes("male") ? "" : "disabled"}>男</button>
              <button class="compact-tab ${state.gender === "female" ? "is-active" : ""}" type="button" data-set-gender="female" ${genders.includes("female") ? "" : "disabled"}>女</button>
            </div>
          </div>
          ${renderSetDyeTabs(modes)}
        </section>
        <section class="gear-sets-basic-info gear-sets-weapon-series-basic">
          <div class="gear-sets-title-row">
            <img class="gear-sets-detail-icon" src="${escapeHtml(getSeriesIcon(seriesEntity))}" alt="" />
            <div class="gear-sets-summary-main">
              <div class="gear-sets-info-grid">
                <span>品级：<strong>${escapeHtml(seriesMaxNumber(seriesEntity, "maxItemLevel", "itemLevel"))}</strong></span>
                <span>装备等级：<strong>${escapeHtml(seriesMaxNumber(seriesEntity, "maxEquipLevel", "equipLevel"))}</strong></span>
                <span>武器：<strong>${escapeHtml(pieces.length)}</strong></span>
                <span>加入版本：<strong>${escapeHtml(getSeriesPatch(seriesEntity) || "-")}</strong></span>
              </div>
              <div class="tag-row">${renderSeriesCardStatusIcons(seriesEntity)}</div>
            </div>
            <div class="gear-sets-actions">
              <button class="wishlist-button ${inWishlist ? "is-active" : ""}" type="button" data-wishlist-toggle data-item-id="${escapeHtml(key)}" aria-pressed="${inWishlist}" aria-label="加入愿望单"></button>
              <button class="favorite-button ${inFavorites ? "is-active" : ""}" type="button" data-favorite-toggle data-item-id="${escapeHtml(key)}" aria-pressed="${inFavorites}" aria-label="加入收藏"></button>
            </div>
          </div>
        </section>
        <section class="gear-sets-relation-region gear-sets-weapon-series-similar">
          <h3>同模系列</h3>
          <div class="gear-sets-model-table-wrap">
            <table class="model-table">
              <thead><tr><th>名称</th><th>品级</th><th>等级</th><th>获取方式</th><th>标签</th></tr></thead>
              <tbody>${renderSimilarSeriesRows(seriesEntity)}</tbody>
            </table>
          </div>
        </section>
        <section class="gear-sets-relation-region gear-sets-weapon-series-note">
          <p class="gear-sets-note">${escapeHtml(seriesEntity.data?.collectionNote || seriesEntity.data?.note || "暂无系列备注。")}</p>
        </section>
        <section class="gear-sets-relation-region gear-sets-weapon-series-members">
          <h3>所属武器</h3>
          <p>${escapeHtml(getSeriesName(seriesEntity))}</p>
          <ul class="gear-sets-piece-list">${renderSeriesMemberList(seriesEntity)}</ul>
        </section>
        <section class="gear-sets-acquisition-region gear-sets-weapon-series-acquisition"></section>
      </div>
    </div>
  `;
  syncActionButtons();
}

function renderSeriesDetail() {
  if (!dom.gearSetsDetailView) return;
  const seriesEntity = state.selectedSeries;
  if (!seriesEntity) {
    dom.gearSetsDetailView.innerHTML = `<div class="gear-sets-empty">请选择一个系列。</div>`;
    return;
  }
  if (seriesEntity.engine === "weaponSeries") {
    renderWeaponSeriesDetail(seriesEntity);
    return;
  }
  const key = getSeriesKey(seriesEntity);
  const pieces = getSeriesPieces(seriesEntity);
  const sets = getSeriesGearSets(seriesEntity);
  const isGearSeries = seriesEntity.engine === "gearSeries";
  const modes = getAvailableSeriesDyeModes(seriesEntity);
  if (!modes.includes(state.dye)) state.dye = "original";
  const genders = getAvailableSeriesPreviewGenders(seriesEntity);
  applyImageGenderPreferenceForGenders(genders);
  const showGenderTabs = genders.length > 1;
  const previewPaths = getSeriesPreviewImageCandidates(seriesEntity);
  const previewAttrs = renderPreviewImageAttrs(previewPaths, "gear-sets-preview-image", `${getSeriesName(seriesEntity)} 预览`);
  const inWishlist = collectionHasAll(state.wishlistIds, key);
  const inFavorites = collectionHasAll(state.favoriteIds, key);
  dom.gearSetsDetailView.innerHTML = `
    <div class="gear-sets-detail-shell gear-sets-detail-shell--series">
      <div class="gear-sets-top">
        <section class="gear-sets-preview-column">
          <div class="gear-sets-preview-stage">
            ${previewAttrs ? `<img ${previewAttrs} />` : `<div class="gear-sets-preview-empty"></div>`}
            <h2 class="gear-sets-preview-title">${escapeHtml(getSeriesName(seriesEntity))}</h2>
            <div class="gear-sets-gender-tabs" ${showGenderTabs ? "" : "hidden"}>
              <button class="compact-tab ${state.gender === "male" ? "is-active" : ""}" type="button" data-set-gender="male" ${genders.includes("male") ? "" : "disabled"}>男</button>
              <button class="compact-tab ${state.gender === "female" ? "is-active" : ""}" type="button" data-set-gender="female" ${genders.includes("female") ? "" : "disabled"}>女</button>
            </div>
            ${renderSetDyeTabs(modes)}
          </div>
          <div class="gear-sets-series-body-grid">
            <section class="gear-sets-relation-region gear-sets-relation-region--series-members">
              <h3>${isGearSeries ? "所属套装" : "所属武器"}</h3>
              <ul class="gear-sets-piece-list">
                ${renderSeriesMemberList(seriesEntity)}
              </ul>
            </section>
            <section class="gear-sets-basic-info">
              <div class="gear-sets-title-row">
                <img class="gear-sets-detail-icon" src="${escapeHtml(getSeriesIcon(seriesEntity))}" alt="" />
                <div class="gear-sets-summary-main">
                  <div class="gear-sets-info-grid">
                    <span>品级：<strong>${escapeHtml(seriesMaxNumber(seriesEntity, "maxItemLevel", "itemLevel"))}</strong></span>
                    <span>装备等级：<strong>${escapeHtml(seriesMaxNumber(seriesEntity, "maxEquipLevel", "equipLevel"))}</strong></span>
                    <span>散件：<strong>${escapeHtml(pieces.length)}</strong></span>
                    <span>套装：<strong>${escapeHtml(sets.length || "-")}</strong></span>
                  </div>
                  <div class="tag-row">${renderSeriesCardStatusIcons(seriesEntity)}</div>
                </div>
                <div class="gear-sets-actions">
                  <button class="wishlist-button ${inWishlist ? "is-active" : ""}" type="button" data-wishlist-toggle data-item-id="${escapeHtml(key)}" aria-pressed="${inWishlist}" aria-label="加入愿望单"></button>
                  <button class="favorite-button ${inFavorites ? "is-active" : ""}" type="button" data-favorite-toggle data-item-id="${escapeHtml(key)}" aria-pressed="${inFavorites}" aria-label="加入收藏"></button>
                </div>
              </div>
            </section>
            <section class="gear-sets-relation-region gear-sets-relation-region--similar-series">
              <div class="gear-sets-model-table-wrap">
                <table class="model-table">
                  <thead><tr><th>名称</th><th>品级</th><th>等级</th><th>获取方式</th><th>标签</th></tr></thead>
                  <tbody>${renderSimilarSeriesRows(seriesEntity)}</tbody>
                </table>
              </div>
            </section>
          </div>
        </section>
      </div>
      <section class="gear-sets-acquisition-region gear-sets-acquisition-region--note">
        <p class="gear-sets-note">${escapeHtml(seriesEntity.data?.collectionNote || seriesEntity.data?.note || "暂无系列备注。")}</p>
      </section>
    </div>
  `;
  syncActionButtons();
}

function resolveWishlistEntity(engine, id) {
  if (engine === "gearPieces" || engine === "accessoryPieces") {
    const data = state.gearPiecesById.get(String(id));
    return data ? { engine, id: String(id), data } : null;
  }
  if (engine === "weaponPieces") {
    const data = state.weaponPiecesById.get(String(id));
    return data ? { engine, id: String(id), data } : null;
  }
  if (engine === "gearSets" || engine === "customGearSets") {
    const setEntity = getGearSetByKey(getEntryKey(engine, id));
    return setEntity ? { engine, id: String(id), data: setEntity.data, setEntity } : null;
  }
  if (engine === "gearSeries" || engine === "weaponSeries") {
    const seriesEntity = getSeriesByKey(getEntryKey(engine, id));
    return seriesEntity ? { engine, id: String(id), data: seriesEntity.data, seriesEntity } : null;
  }
  return null;
}

function getResolvedWishlistItems() {
  return getWishlistData().items.map((entry) => ({ ...entry, entity: resolveWishlistEntity(entry.engine, entry.id) })).filter((entry) => entry.entity);
}

function getWishlistName(item) {
  if (!item?.entity) return "数据已失效";
  if (item.engine === "gearSets" || item.engine === "customGearSets") return getGearSetName(item.entity.setEntity);
  if (item.engine === "gearSeries" || item.engine === "weaponSeries") return getSeriesName(item.entity.seriesEntity);
  return item.entity.data.name || item.id;
}

function getWishlistMeta(item) {
  if (item.engine === "gearSets" || item.engine === "customGearSets") {
    return `${item.engine === "gearSets" ? "官方套装" : "自定义套装"} / ${getGearSetPieces(item.entity.setEntity).length} 件 / 品级 ${gearSetMaxNumber(item.entity.setEntity, "ilvl", "itemLevel")}`;
  }
  if (item.engine === "gearSeries" || item.engine === "weaponSeries") {
    return `${ENGINE_LABELS[item.engine]} / ${getSeriesPieces(item.entity.seriesEntity).length} 件 / 品级 ${seriesMaxNumber(item.entity.seriesEntity, "maxItemLevel", "itemLevel")}`;
  }
  const data = item.entity.data;
  return [`Lv${data.equipLevel}`, data.weaponType || data.weaponSlot || data.equipSlot || data.slotCategory, `品级 ${data.itemLevel}`].filter(Boolean).join(" / ");
}

function getWishlistSourceSummary(item) {
  if (!item?.entity) return "来源未记录";
  if (item.engine === "gearSets" || item.engine === "customGearSets") return getGearSetSourceText(item.entity.setEntity);
  if (item.engine === "gearSeries" || item.engine === "weaponSeries") return getSeriesSourceText(item.entity.seriesEntity);
  return getSourceText(item.entity.data);
}

function getWishlistGroup(item) {
  const text = getWishlistSourceSummary(item);
  if (!text || text === "来源未记录") return "来源未记录";
  if (text.includes("商城")) return "商城";
  if (text.includes("制作")) return "制作";
  if (text.includes("NPC购买")) return "NPC购买";
  if (/兑换|神典石|货币|军票|金碟|狼印|双色宝石|工票/.test(text)) return "点数/货币兑换";
  if (/副本|讨伐|歼灭|团队任务|大型任务|零式/.test(text)) return "战斗内容";
  if (/PVP|狼印/.test(text)) return "PVP";
  if (/任务|成就/.test(text)) return "任务/成就";
  if (/季节活动|活动|联动/.test(text)) return "活动";
  return "其他";
}

function renderWishlistEntityTags(item) {
  if (item.engine === "gearSets" || item.engine === "customGearSets") return renderGearSetCardStatusIcons(item.entity.setEntity);
  if (item.engine === "gearSeries" || item.engine === "weaponSeries") return renderSeriesCardStatusIcons(item.entity.seriesEntity);
  return renderItemCardStatusIcons(item.entity.data, { isWeapon: item.engine === "weaponPieces" });
}

function renderWishlistIcon(item) {
  if (item.engine === "gearSets" || item.engine === "customGearSets") {
    const icon = getGearSetIcon(item.entity.setEntity);
    return icon ? `<img class="wishlist-result-card__icon" src="${escapeHtml(icon)}" alt="" />` : `<div class="wishlist-result-card__icon"></div>`;
  }
  if (item.engine === "gearSeries" || item.engine === "weaponSeries") {
    const icon = getSeriesIcon(item.entity.seriesEntity);
    return icon ? `<img class="wishlist-result-card__icon" src="${escapeHtml(icon)}" alt="" />` : `<div class="wishlist-result-card__icon"></div>`;
  }
  return `<img ${renderIconImageAttrs(item.entity.data, "wishlist-result-card__icon")} />`;
}

function buildWishlistEntityItem(key) {
  const { engine, id } = parseEntryKey(key);
  const entity = resolveWishlistEntity(engine, id);
  return entity ? { engine, id, entity } : null;
}

function getWishlistRecommendationPreview(item) {
  return getWishlistRecommendationPreviewCandidates(item)[0] || "";
}

function getWishlistRecommendationPreviewCandidates(item) {
  if (!item?.entity) return [];
  if (item.engine === "gearSets" || item.engine === "customGearSets") {
    return getGearSetPreviewImageCandidates(item.entity.setEntity);
  }
  if (item.engine === "gearSeries" || item.engine === "weaponSeries") {
    return getSeriesPreviewImageCandidates(item.entity.seriesEntity);
  }
  return [getPreviewImagePath(item.entity.data)].filter(Boolean);
}

function renderWishlistRecommendationPreview(item) {
  const imageAttrs = renderPreviewImageAttrs(getWishlistRecommendationPreviewCandidates(item), "", `${getWishlistName(item)} 预览`);
  if (!imageAttrs) return `<span class="wishlist-rec-preview wishlist-rec-preview-missing">暂无缩略图</span>`;
  return `<span class="wishlist-rec-preview"><img ${imageAttrs} /></span>`;
}

function renderRecommendationCard(item, label, isRecommended = false) {
  if (!item) return "";
  const icon = item.engine === "gearSets" || item.engine === "customGearSets"
    ? getGearSetIcon(item.entity.setEntity)
    : item.engine === "gearSeries" || item.engine === "weaponSeries"
      ? getSeriesIcon(item.entity.seriesEntity)
      : getIconUrl(item.entity.data);
  return `
    <button class="wishlist-recommend-card ${isRecommended ? "is-selected" : ""}" type="button" data-recommendation-choice="${isRecommended ? "recommended" : "original"}" aria-pressed="${isRecommended}">
      <span class="wishlist-recommend-label ${isRecommended ? "wishlist-recommend-best" : ""}">${escapeHtml(label)}</span>
      <span class="wishlist-rec-card-inner">
        <span class="wishlist-rec-card-info">
          ${icon ? `<img class="wishlist-rec-card-icon" src="${escapeHtml(icon)}" alt="" />` : `<span class="wishlist-rec-card-icon wishlist-rec-card-icon-missing"></span>`}
          <span class="wishlist-rec-card-body">
            <strong class="wishlist-rec-card-name">${escapeHtml(getWishlistName(item))}</strong>
            <span class="wishlist-rec-card-subtitle">${escapeHtml(getWishlistMeta(item))}</span>
            <span class="wishlist-rec-card-source">${escapeHtml(getWishlistSourceSummary(item))}</span>
            <span class="tag-row wishlist-rec-card-tags">${renderWishlistEntityTags(item)}</span>
          </span>
        </span>
        ${renderWishlistRecommendationPreview(item)}
      </span>
    </button>
  `;
}

function removeWishlistKeys(keys) {
  const targetKeys = new Set(keys.map(String));
  if (!targetKeys.size) return;
  const data = getWishlistData();
  data.items = data.items.filter((item) => !targetKeys.has(getEntryKey(item.engine, item.id)));
  setWishlistData(data);
}

function addWishlistKey(key) {
  const keys = getCollectionItemKeysFromKey(key);
  if (!keys.length) return;
  const data = getWishlistData();
  const existing = new Set(data.items.map((item) => getEntryKey(item.engine, item.id)));
  keys.forEach((entryKey) => {
    if (existing.has(entryKey)) return;
    const { engine, id } = parseEntryKey(entryKey);
    data.items.push({
      engine,
      id: String(id),
      addedAt: new Date().toISOString(),
      priority: "normal",
      status: "wanted",
      note: "",
      tags: [],
    });
  });
  setWishlistData(data);
}

function applyWishlistRecommendationChoice(originalKey, recommendedKey, choice, cleanupOriginal) {
  if (choice === "recommended") {
    if (cleanupOriginal) removeWishlistKeys(getCollectionItemKeysFromKey(originalKey));
    addWishlistKey(recommendedKey);
  } else {
    addWishlistKey(originalKey);
  }
  syncActionButtons();
  if (state.currentEngine === "wishlist") renderWishlistList();
  renderCurrentFilters();
}

function openWishlistRecommendationModal(originalKey, recommendedKey) {
  const originalItem = buildWishlistEntityItem(originalKey);
  const recommendedItem = buildWishlistEntityItem(recommendedKey);
  if (!originalItem || !recommendedItem) {
    addWishlistKey(originalKey);
    syncActionButtons();
    return;
  }
  const cleanupEnabled = Boolean(state.appSettings.cleanupReplacedItems);
  openAppModal({
    title: "发现推荐替代",
    subtitle: "同模装备会优先推荐收藏柜、染色或综合评分更好的版本",
    className: "app-modal--wishlist-recommend",
    body: `
      <div class="wishlist-recommend-compare">
        ${renderRecommendationCard(originalItem, "原选项")}
        ${renderRecommendationCard(recommendedItem, "推荐选项", true)}
      </div>
      <label class="wishlist-recommend-cleanup-option">
        <input type="checkbox" id="wishlistRecommendCleanup" ${cleanupEnabled ? "checked" : ""}>
        <span>添加推荐选项，并清除已添加的被替代选项</span>
      </label>
    `,
    footer: `
      <button class="app-modal-button" type="button" data-close-app-modal>取消</button>
      <button class="app-modal-button app-modal-button--primary" type="button" data-recommendation-confirm>确定</button>
    `,
  });
  const overlay = document.querySelector(".app-modal-overlay");
  overlay?.addEventListener("click", (event) => {
    const card = event.target.closest("[data-recommendation-choice]");
    if (card) {
      overlay.querySelectorAll("[data-recommendation-choice]").forEach((node) => {
        const selected = node === card;
        node.classList.toggle("is-selected", selected);
        node.setAttribute("aria-pressed", String(selected));
      });
      return;
    }
    if (event.target.closest("#wishlistRecommendCleanup")) {
      const recommended = overlay.querySelector("[data-recommendation-choice='recommended']");
      recommended?.click();
      return;
    }
    if (event.target.closest("[data-recommendation-confirm]")) {
      const selected = overlay.querySelector("[data-recommendation-choice].is-selected")?.dataset.recommendationChoice || "recommended";
      const cleanup = Boolean(overlay.querySelector("#wishlistRecommendCleanup")?.checked);
      closeAppModal();
      applyWishlistRecommendationChoice(originalKey, recommendedKey, selected, cleanup);
    }
  });
}

function handleWishlistToggle(key) {
  if (!key) return;
  if (collectionHasAll(state.wishlistIds, key)) {
    toggleWishlist(key);
    syncActionButtons();
    if (state.currentEngine === "wishlist") renderWishlistList();
    renderCurrentFilters();
    return;
  }
  const mode = state.appSettings.recommendationMode;
  const recommendedKey = mode === "off" ? "" : getWishlistRecommendationForKey(key);
  if (!recommendedKey) {
    addWishlistKey(key);
  } else if (mode === "auto") {
    applyWishlistRecommendationChoice(key, recommendedKey, "recommended", state.appSettings.cleanupReplacedItems);
    return;
  } else {
    openWishlistRecommendationModal(key, recommendedKey);
    return;
  }
  syncActionButtons();
  if (state.currentEngine === "wishlist") renderWishlistList();
  renderCurrentFilters();
}

function getSelectedWishlistItem(items) {
  return items.find((item) => getEntryKey(item.engine, item.id) === state.selectedWishlistKey) || items[0] || null;
}

function renderWishlistList() {
  const items = getResolvedWishlistItems();
  if (dom.wishlistToolbarSummary) dom.wishlistToolbarSummary.textContent = `愿望单 ${items.length} 条`;
  dom.wishlistModeButtons.forEach((button) => {
    const active = button.dataset.wishlistViewMode === state.wishlistViewMode;
    button.classList.toggle("is-active", active);
    button.setAttribute("aria-pressed", String(active));
  });
  if (items.length === 0) {
    state.selectedWishlistKey = "";
    dom.resultList.innerHTML = `<div class="empty-result"><p>愿望单是空的。</p><p class="empty-result-tip">在装备、套装或武器详情页点击购物车按钮即可加入。</p></div>`;
    return;
  }
  const selected = getSelectedWishlistItem(items);
  state.selectedWishlistKey = state.wishlistViewMode === "detail" && selected ? getEntryKey(selected.engine, selected.id) : "";
  const groups = new Map();
  items.forEach((item) => {
    const group = getWishlistGroup(item);
    if (!groups.has(group)) groups.set(group, []);
    groups.get(group).push(item);
  });
  dom.resultList.innerHTML = WISHLIST_SOURCE_GROUP_ORDER.filter((group) => groups.has(group)).map((group) => {
    const groupItems = groups.get(group);
    return `
      <section class="wishlist-group">
        <header class="wishlist-group-header"><span>${escapeHtml(group)}</span><span class="wishlist-group-count">${groupItems.length} 条</span></header>
        <div class="wishlist-result-grid">${groupItems.map((item) => {
          const key = getEntryKey(item.engine, item.id);
          return `
            <article class="wishlist-result-card ${state.wishlistViewMode === "detail" && key === state.selectedWishlistKey ? "is-selected" : ""}" data-wishlist-select="${escapeHtml(key)}">
              ${renderWishlistIcon(item)}
              <div class="wishlist-result-card__body">
                <div class="wishlist-result-card__title-row"><h3 class="wishlist-result-card__title">${escapeHtml(getWishlistName(item))}</h3><span class="wishlist-result-card__id">#${escapeHtml(item.id)}</span></div>
                <div class="wishlist-result-card__meta">${escapeHtml(getWishlistMeta(item))}</div>
                <div class="wishlist-result-card__source">来源：${escapeHtml(getWishlistSourceSummary(item))}</div>
                <div class="wishlist-result-card__tags">${renderWishlistEntityTags(item)}</div>
              </div>
              <div class="wishlist-result-card__actions">
                <button type="button" data-wishlist-acquired="${escapeHtml(item.engine)}" data-wishlist-id="${escapeHtml(item.id)}" data-wishlist-status="${escapeHtml(item.status || "wanted")}">${item.status === "acquired" ? "取消" : "完成"}</button>
                <button type="button" data-wishlist-remove="${escapeHtml(item.engine)}" data-wishlist-id="${escapeHtml(item.id)}">移除</button>
              </div>
            </article>
          `;
        }).join("")}</div>
      </section>
    `;
  }).join("");
  if (state.wishlistViewMode === "detail" && selected) renderWishlistDetail(selected);
}

function getResolvedFavoriteItems() {
  return Array.from(state.favoriteIds)
    .map((key) => {
      const { engine, id } = parseEntryKey(key);
      return { engine, id, entity: resolveWishlistEntity(engine, id) };
    })
    .filter((entry) => entry.entity);
}

function renderFavoritesList() {
  const items = getResolvedFavoriteItems();
  if (!items.length) {
    dom.resultList.innerHTML = `<div class="empty-result"><p>我的收藏是空的。</p><p class="empty-result-tip">在装备、套装、系列或武器页点击心形按钮即可加入。</p></div>`;
    return;
  }
  const groups = new Map();
  items.forEach((item) => {
    const group = getWishlistGroup(item);
    if (!groups.has(group)) groups.set(group, []);
    groups.get(group).push(item);
  });
  dom.resultList.innerHTML = WISHLIST_SOURCE_GROUP_ORDER.filter((group) => groups.has(group)).map((group) => {
    const groupItems = groups.get(group);
    return `
      <section class="wishlist-group">
        <header class="wishlist-group-header"><span>${escapeHtml(group)}</span><span class="wishlist-group-count">${groupItems.length} 条</span></header>
        <div class="wishlist-result-grid">${groupItems.map((item) => {
          const key = getEntryKey(item.engine, item.id);
          return `
            <article class="wishlist-result-card" data-favorite-select="${escapeHtml(key)}">
              ${renderWishlistIcon(item)}
              <div class="wishlist-result-card__body">
                <div class="wishlist-result-card__title-row"><h3 class="wishlist-result-card__title">${escapeHtml(getWishlistName(item))}</h3><span class="wishlist-result-card__id">#${escapeHtml(item.id)}</span></div>
                <div class="wishlist-result-card__meta">${escapeHtml(getWishlistMeta(item))}</div>
                <div class="wishlist-result-card__source">来源：${escapeHtml(getWishlistSourceSummary(item))}</div>
                <div class="wishlist-result-card__tags">${renderWishlistEntityTags(item)}</div>
              </div>
              <div class="wishlist-result-card__actions">
                <button type="button" data-favorite-toggle data-item-id="${escapeHtml(key)}">移除</button>
              </div>
            </article>
          `;
        }).join("")}</div>
      </section>
    `;
  }).join("");
}

function renderWishlistDetail(item) {
  if (!item?.entity) return;
  if (item.engine === "gearSets" || item.engine === "customGearSets") {
    state.selectedGearSet = item.entity.setEntity;
    dom.detailTop.hidden = true;
    dom.acquisitionRegion.hidden = true;
    dom.gearSetsDetailView.hidden = false;
    renderGearSetDetail();
  } else {
    const previous = state.currentEngine;
    state.currentEngine = item.engine;
    setActivePieces(item.engine);
    setSelectedItemId(item.id);
    dom.detailTop.hidden = false;
    dom.acquisitionRegion.hidden = false;
    dom.gearSetsDetailView.hidden = true;
    renderDetail();
    state.currentEngine = previous;
  }
}

function isInstanceContentItem(item) {
  const data = item?.entity?.data || item;
  const fields = getSourceFieldValues(data);
  return fields.categories.includes("instanceContent") || fields.categories.includes("副本");
}

function getDetailTextByKind(entry, kind) {
  if (!Array.isArray(entry?.detail)) return "";
  return String(entry.detail.find((detail) => detail?.kind === kind)?.text || "").trim();
}

function getEntryDetailTexts(entry) {
  const details = Array.isArray(entry?.detail)
    ? entry.detail.map((detail) => String(detail?.text || "").trim()).filter(Boolean)
    : [];
  if (entry?.detailSub) details.push(String(entry.detailSub).trim());
  return details.filter(Boolean);
}

function isGilTokenText(token) {
  return /金币|gil/i.test(String(token || ""));
}

function parseTokenParts(tokenText) {
  return String(tokenText || "")
    .split("/")
    .map((part) => part.trim())
    .filter((part) => part && part !== RANDOM_BOX_DROP_TEXT && part !== LEGACY_DIRECT_DROP_TEXT)
    .map((part) => {
      const match = part.match(/^(.*?)\s*[x×]\s*(\d+(?:\.\d+)?)$/i);
      return {
        name: match ? match[1].trim() : part,
        amount: match ? Number(match[2]) : 1,
      };
    })
    .filter((part) => part.name);
}

function getInstanceTokenInfo(token, type = "") {
  const tokenText = String(token || "").trim();
  const tokenParts = parseTokenParts(tokenText);
  const hasRandomBoxDrop =
    tokenText
      .split("/")
      .map((part) => part.trim())
      .some((part) => part === RANDOM_BOX_DROP_TEXT || part === LEGACY_DIRECT_DROP_TEXT)
    || !(tokenText && !isGilTokenText(tokenText) && !/购买/.test(type));
  return {
    hasRandomBoxDrop,
    tokenParts,
    tokenText: formatInstanceTokenText({ hasRandomBoxDrop, tokenParts }),
  };
}

function formatTokenAmount(amount) {
  return Number.isInteger(amount) ? amount : amount.toLocaleString("zh-CN");
}

function formatTokenPart(token) {
  return `${token.name} x${formatTokenAmount(token.amount)}`;
}

function isCofferTokenName(name) {
  return /箱/.test(String(name || ""));
}

function getTokenDisplayOrder(token) {
  return isCofferTokenName(token?.name) ? 1 : 2;
}

function sortTokenPartsForDisplay(parts) {
  return [...parts].sort((left, right) => {
    const orderDiff = getTokenDisplayOrder(left) - getTokenDisplayOrder(right);
    if (orderDiff) return orderDiff;
    return String(left.name || "").localeCompare(String(right.name || ""), "zh-Hans-CN");
  });
}

function mergeTokenParts(parts) {
  const totals = new Map();
  parts.forEach((token) => {
    if (!token?.name) return;
    totals.set(token.name, (totals.get(token.name) || 0) + (Number(token.amount) || 1));
  });
  return sortTokenPartsForDisplay(Array.from(totals.entries()).map(([name, amount]) => ({ name, amount })));
}

function buildTokenInstanceLookup() {
  if (state.tokenInstanceLookup) return state.tokenInstanceLookup;
  const lookup = new Map();
  const instances = state.instanceTokenSourceMap?.instances || {};
  Object.values(instances).forEach((instance) => {
    const instanceRef = {
      instanceName: instance.name,
      instanceId: Number.isFinite(Number(instance.instanceId)) ? Number(instance.instanceId) : Number.MAX_SAFE_INTEGER,
      contentType: instance.contentType || "",
      requiredLevel: instance.requiredLevel || "",
      supportsRandomDrop: Boolean(instance.supportsRandomDrop),
    };
    (instance.tokens || []).forEach((token) => {
      const name = String(token?.name || "").trim();
      if (!name) return;
      if (!lookup.has(name)) lookup.set(name, []);
      lookup.get(name).push({
        ...instanceRef,
        tokenName: name,
        sourceLabel: token.sourceLabel || "",
        level: token.level || "",
      });
    });
  });
  state.tokenInstanceLookup = lookup;
  return lookup;
}

function getMappedInstancesForToken(tokenName) {
  return buildTokenInstanceLookup().get(String(tokenName || "").trim()) || [];
}

function getInstanceMapEntry(instanceName) {
  return state.instanceTokenSourceMap?.instances?.[instanceName] || null;
}

function formatInstanceTokenText({ hasRandomBoxDrop = false, tokenParts = [] } = {}) {
  const parts = [];
  if (hasRandomBoxDrop) parts.push(RANDOM_BOX_DROP_TEXT);
  parts.push(...sortTokenPartsForDisplay(tokenParts).map(formatTokenPart));
  return parts.join(" / ") || RANDOM_BOX_DROP_TEXT;
}

function getInstanceAnchorNames(item) {
  return uniqueList((Array.isArray(item?.instanceNames) ? item.instanceNames : [])
    .map((name) => String(name || "").trim())
    .filter(Boolean));
}

function getInstanceSortId(instanceName) {
  const mapEntry = getInstanceMapEntry(instanceName);
  const id = Number(mapEntry?.instanceId);
  return Number.isFinite(id) ? id : Number.MAX_SAFE_INTEGER;
}

function getInstanceRef(instanceName) {
  const mapEntry = getInstanceMapEntry(instanceName);
  return {
    instanceName,
    instanceId: getInstanceSortId(instanceName),
    contentType: mapEntry?.contentType || "",
    requiredLevel: mapEntry?.requiredLevel || "",
  };
}

function getWishlistInstanceEvidenceFromAcquisition(acquisition) {
  const tokenSources = new Map();
  const randomSources = new Map();
  acquisition.forEach((entry) => {
    const tokenText = String(getAcquisitionTokenText(entry) || "").trim();
    const type = String(entry?.type || "").trim();
    if (isGilTokenText(tokenText) || /购买/.test(type)) return;
    parseTokenParts(tokenText).forEach((part) => {
      const amount = Number(part.amount) || 1;
      const mappedInstances = uniqueList(getMappedInstancesForToken(part.name).map((instance) => instance.instanceName).filter(Boolean));
      const existing = tokenSources.get(part.name);
      if (!existing || amount < existing.amount) {
        tokenSources.set(part.name, {
          name: part.name,
          amount,
          kind: isCofferTokenName(part.name) ? "coffer" : "token",
          mappedInstances,
        });
      } else if (existing) {
        existing.mappedInstances = uniqueList([...(existing.mappedInstances || []), ...mappedInstances]);
      }
    });
    const tokenInfo = getInstanceTokenInfo(tokenText, type);
    if (!tokenInfo.hasRandomBoxDrop) return;
    const instanceName = getDetailTextByKind(entry, "instance");
    if (!instanceName) return;
    randomSources.set(instanceName, {
      name: RANDOM_BOX_DROP_TEXT,
      amount: 1,
      kind: "random",
      mappedInstances: [instanceName],
      directInstance: getInstanceRef(instanceName),
    });
  });
  return [...tokenSources.values(), ...randomSources.values()];
}

function getEvidenceVoteInstanceNames(source, anchorNames) {
  const mapped = source.kind === "random"
    ? (source.directInstance?.instanceName ? [source.directInstance.instanceName] : [])
    : (source.mappedInstances || []);
  return uniqueList(mapped.filter((name) => anchorNames.includes(name)));
}

function buildWishlistInstanceVoteTotals(candidates) {
  const totals = new Map();
  candidates.forEach((candidate) => {
    candidate.sources.forEach((source) => {
      getEvidenceVoteInstanceNames(source, candidate.anchorNames).forEach((instanceName) => {
        totals.set(instanceName, (totals.get(instanceName) || 0) + 1);
      });
    });
  });
  return totals;
}

function chooseWishlistMainInstance(anchorNames, voteTotals) {
  if (!anchorNames.length) return null;
  return [...anchorNames].sort((left, right) => {
    const voteDiff = (voteTotals.get(right) || 0) - (voteTotals.get(left) || 0);
    if (voteDiff) return voteDiff;
    const idDiff = getInstanceSortId(left) - getInstanceSortId(right);
    if (idDiff) return idDiff;
    return left.localeCompare(right, "zh-Hans-CN");
  })[0];
}

function buildOtherInstanceRefs(anchorNames, mainInstanceName, sources) {
  return anchorNames
    .filter((name) => name && name !== mainInstanceName)
    .map((name) => ({
      ...getInstanceRef(name),
      tokens: uniqueList(sources
        .filter((source) => getEvidenceVoteInstanceNames(source, anchorNames).includes(name))
        .map((source) => source.name)
        .filter(Boolean)),
    }));
}

function getOtherInstanceKey(instances) {
  return (instances || []).map((instance) => instance.instanceName).filter(Boolean).join("|");
}

function mergeOtherInstances(instances) {
  const byName = new Map();
  (instances || []).forEach((instance) => {
    const instanceName = instance?.instanceName || "";
    if (!instanceName) return;
    const existing = byName.get(instanceName) || { ...getInstanceRef(instanceName), tokens: [] };
    existing.tokens = uniqueList([...(existing.tokens || []), ...(instance.tokens || [])].filter(Boolean));
    byName.set(instanceName, existing);
  });
  return Array.from(byName.values());
}

function formatOtherInstanceListItem(instance) {
  const tokens = (instance.tokens || []).join("/");
  return `${instance.instanceName}${tokens ? `（掉落${tokens}）` : ""}`;
}

function getWishlistInstanceStatRows() {
  const candidates = getResolvedWishlistItems()
    .filter((item) => ["gearPieces", "accessoryPieces", "weaponPieces"].includes(item.engine))
    .filter((item) => isInstanceContentItem(item))
    .map((item) => {
      const data = item.entity.data;
      const acquisition = getAcquisitionEntries(data);
      return {
        item,
        data,
        acquisition,
        anchorNames: getInstanceAnchorNames(data),
        sources: getWishlistInstanceEvidenceFromAcquisition(acquisition),
      };
    });
  const voteTotals = buildWishlistInstanceVoteTotals(candidates);
  const rows = candidates.map((candidate) => {
    const { item, acquisition, anchorNames, sources } = candidate;
    const mainInstanceName = chooseWishlistMainInstance(anchorNames, voteTotals);
    const tokenParts = sources
      .filter((source) => source.kind !== "random")
      .map((source) => ({ name: source.name, amount: source.amount }));
    const hasRandomBoxDrop = sources.some((source) => source.kind === "random");
    const mainRef = mainInstanceName ? getInstanceRef(mainInstanceName) : null;
    const npcTexts = uniqueList(acquisition.flatMap((entry) => {
      if (!entry || isGilTokenText(getAcquisitionTokenText(entry)) || /购买/.test(String(entry?.type || ""))) return [];
        const npc = getDetailTextByKind(entry, "npc");
        const location = getDetailTextByKind(entry, "location");
      return npc ? [`${npc}${location ? ` / ${location}` : ""}`] : [];
    }));
    const notes = uniqueList(acquisition.flatMap((entry) => getEntryDetailTexts(entry)).filter((text) => text !== RANDOM_BOX_DROP_TEXT && text !== LEGACY_DIRECT_DROP_TEXT));
    const otherInstances = mainInstanceName ? buildOtherInstanceRefs(anchorNames, mainInstanceName, sources) : [];
    return {
      item,
      instanceName: mainRef?.instanceName || "副本详情待确认",
      instanceId: mainRef?.instanceId ?? Number.MAX_SAFE_INTEGER,
      tokenText: formatInstanceTokenText({ hasRandomBoxDrop, tokenParts }),
      tokenParts: mergeTokenParts(tokenParts),
      hasRandomBoxDrop,
      npcText: npcTexts.join("；"),
      noteText: notes.slice(0, 2).join("；"),
      otherInstances,
    };
    });
  return collapseWishlistInstanceItemRows(rows);
}

function getWishlistInstanceItemRowKey(row) {
  return [
    getEntryKey(row.item.engine, row.item.id),
    row.instanceName || "副本详情待确认",
  ].join("|");
}

function collapseWishlistInstanceItemRows(rows) {
  const byKey = new Map();
  rows.forEach((row) => {
    const key = getWishlistInstanceItemRowKey(row);
    const existing = byKey.get(key);
    if (!existing) {
      byKey.set(key, {
        ...row,
        tokenParts: mergeTokenParts(row.tokenParts || []),
        hasRandomBoxDrop: Boolean(row.hasRandomBoxDrop || !row.tokenParts?.length),
        npcTexts: uniqueList([row.npcText].filter(Boolean)),
        noteTexts: uniqueList([row.noteText].filter(Boolean)),
      });
      return;
    }
    existing.hasRandomBoxDrop = existing.hasRandomBoxDrop || Boolean(row.hasRandomBoxDrop || !row.tokenParts?.length);
    existing.tokenParts = mergeTokenParts([...(existing.tokenParts || []), ...(row.tokenParts || [])]);
    existing.npcTexts = uniqueList([...(existing.npcTexts || []), row.npcText].filter(Boolean));
    existing.noteTexts = uniqueList([...(existing.noteTexts || []), row.noteText].filter(Boolean));
    existing.otherInstanceNames = uniqueList([...(existing.otherInstanceNames || []), ...(row.otherInstanceNames || [])]);
  });
  return Array.from(byKey.values()).map((row) => ({
    ...row,
    tokenText: formatInstanceTokenText(row),
    npcText: (row.npcTexts || []).join("；"),
    noteText: (row.noteTexts || []).join("；"),
  }));
}

function buildWishlistInstanceStats() {
  const rows = getWishlistInstanceStatRows();
  const groups = new Map();
  rows.forEach((row) => {
    const key = row.instanceName || "副本详情待确认";
    if (!groups.has(key)) {
      groups.set(key, {
        instanceName: key,
        rows: [],
        tokenTotals: new Map(),
        npcTexts: [],
        directDropCount: 0,
      });
    }
    const group = groups.get(key);
    group.rows.push(row);
    group.npcTexts = uniqueList([
      ...(group.npcTexts || []),
      ...(row.npcText || "").split("；").map((text) => text.trim()).filter(Boolean),
    ]);
    if (row.tokenParts.length) {
      row.tokenParts.forEach((token) => {
        const current = group.tokenTotals.get(token.name) || 0;
        group.tokenTotals.set(token.name, current + token.amount);
      });
    }
    if (row.hasRandomBoxDrop || !row.tokenParts.length) {
      group.directDropCount += 1;
    }
  });
  const groupsList = Array.from(groups.values()).map((group) => ({
    ...group,
    rows: group.rows.sort((left, right) => getWishlistName(left.item).localeCompare(getWishlistName(right.item), "zh-Hans-CN")),
    tokenSummary: sortTokenPartsForDisplay(Array.from(group.tokenTotals.entries()).map(([name, amount]) => ({ name, amount }))).map(formatTokenPart),
  })).sort((left, right) => {
    if (right.rows.length !== left.rows.length) return right.rows.length - left.rows.length;
    return left.instanceName.localeCompare(right.instanceName, "zh-Hans-CN");
  });
  return {
    itemCount: new Set(rows.map((row) => getEntryKey(row.item.engine, row.item.id))).size,
    rowCount: rows.length,
    instanceCount: groupsList.length,
    groups: groupsList,
  };
}

function renderWishlistInstanceStats(stats) {
  if (!stats.itemCount) {
    return `<div class="wishlist-route-empty">当前愿望单里没有来源大类为“副本”的物品。</div>`;
  }
  return `
    <div class="wishlist-route-summary wishlist-instance-summary">
      <span>副本物品 <strong>${escapeHtml(stats.itemCount)}</strong> 件</span>
      <span>涉及副本 <strong>${escapeHtml(stats.instanceCount)}</strong> 个</span>
      <span>统计条目 <strong>${escapeHtml(stats.rowCount)}</strong> 条</span>
    </div>
    <div class="wishlist-route-stations wishlist-instance-groups">
      ${stats.groups.map((group) => renderWishlistInstanceGroup(group)).join("")}
    </div>
  `;
}

function renderWishlistInstanceGroupSummary(group) {
  const lines = [];
  if (group.tokenSummary.length) {
    lines.push(`需要：${group.tokenSummary.join(" / ")}`);
  } else if (group.directDropCount) {
    lines.push(`${RANDOM_BOX_DROP_TEXT} ${group.directDropCount} 件`);
  }
  if (group.npcTexts?.length) {
    lines.push(`兑换NPC：${group.npcTexts.join("；")}`);
  }
  if (!lines.length) lines.push(RANDOM_BOX_DROP_TEXT);
  return `<div class="wishlist-instance-group-summary">${lines.map((line) => `<span>${escapeHtml(line)}</span>`).join("")}</div>`;
}

function renderWishlistInstanceGroup(group) {
  const subgroups = buildWishlistInstanceSubgroups(group);
  return `
    <section class="wishlist-route-station wishlist-instance-group">
      <header class="wishlist-route-station__header">
        <div>
          <h3>${escapeHtml(group.instanceName)}</h3>
          ${renderWishlistInstanceGroupSummary(group)}
        </div>
        <span>${group.rows.length} 件</span>
      </header>
      <div class="wishlist-instance-item-list">
        ${subgroups.map((subgroup) => renderWishlistInstanceSubgroup(group, subgroup)).join("")}
      </div>
    </section>
  `;
}

function buildWishlistInstanceSubgroups(group) {
  const byKey = new Map();
  group.rows.forEach((row) => {
    const otherKey = getOtherInstanceKey(row.otherInstances || []);
    const key = otherKey || "__only-main__";
    if (!byKey.has(key)) {
      byKey.set(key, {
        key,
        otherInstances: [],
        rows: [],
        tokenTotals: new Map(),
        directDropCount: 0,
      });
    }
    const subgroup = byKey.get(key);
    subgroup.otherInstances = mergeOtherInstances([...(subgroup.otherInstances || []), ...(row.otherInstances || [])]);
    subgroup.rows.push(row);
    (row.tokenParts || []).forEach((token) => {
      subgroup.tokenTotals.set(token.name, (subgroup.tokenTotals.get(token.name) || 0) + token.amount);
    });
    if (row.hasRandomBoxDrop || !row.tokenParts?.length) subgroup.directDropCount += 1;
  });
  return Array.from(byKey.values()).map((subgroup) => ({
    ...subgroup,
    rows: subgroup.rows.sort((left, right) => getWishlistName(left.item).localeCompare(getWishlistName(right.item), "zh-Hans-CN")),
    tokenSummary: sortTokenPartsForDisplay(Array.from(subgroup.tokenTotals.entries()).map(([name, amount]) => ({ name, amount }))).map(formatTokenPart),
  })).sort((left, right) => {
    if (left.key === "__only-main__" && right.key !== "__only-main__") return -1;
    if (right.key === "__only-main__" && left.key !== "__only-main__") return 1;
    if (right.rows.length !== left.rows.length) return right.rows.length - left.rows.length;
    return left.key.localeCompare(right.key, "zh-Hans-CN");
  });
}

function renderWishlistInstanceOtherNote(subgroup) {
  const instances = subgroup.otherInstances || [];
  if (!instances.length) return "";
  return `
    <div class="wishlist-instance-subgroup__note">
      <span>其他副本：</span>
      <ul>
        ${instances.map((instance) => `<li>${escapeHtml(formatOtherInstanceListItem(instance))}</li>`).join("")}
      </ul>
    </div>
  `;
}

function renderWishlistInstanceSubgroup(group, subgroup) {
  return `
    <section class="wishlist-instance-subgroup">
      <div class="wishlist-instance-subgroup__items">
        ${subgroup.rows.map((row) => `
          <div class="wishlist-instance-item">
            <span class="wishlist-instance-item__name">${escapeHtml(getWishlistName(row.item))}</span>
            <span class="wishlist-instance-item__meta">${escapeHtml(getWishlistMeta(row.item))}</span>
            <strong>${escapeHtml(row.tokenText)}</strong>
            ${renderWishlistInstanceItemNotes({ ...row, npcText: "", noteText: "" })}
          </div>
        `).join("")}
      </div>
      ${renderWishlistInstanceOtherNote(subgroup)}
    </section>
  `;
}

function renderWishlistInstanceItemNotes(row) {
  const notes = uniqueList([row.npcText, row.noteText].filter(Boolean));
  if (!notes.length) return "";
  return `<small>${escapeHtml(notes.join("；"))}</small>`;
}

function openWishlistInstanceStatsModal() {
  const stats = buildWishlistInstanceStats();
  openAppModal({
    title: "愿望单副本统计",
    subtitle: "按副本锚点归组，并按 acquisition 中的 token 汇总",
    className: "app-modal--route-planner app-modal--instance-stats",
    body: `<div class="wishlist-route-result">${renderWishlistInstanceStats(stats)}</div>`,
    footer: `<button class="app-modal-button" type="button" data-close-app-modal>关闭</button>`,
  });
}

function getRouteAetherytes() {
  const byId = new Map();
  const add = (aetheryte) => {
    const id = String(aetheryte?.id ?? "");
    const name = String(aetheryte?.name ?? "").trim();
    if (!id || !name || byId.has(id)) return;
    if (id === "1" || name === "城内以太之晶") return;
    byId.set(id, { ...aetheryte, id, name });
  };
  (state.teleportCostIndex?.aetherytes || []).forEach(add);
  (state.gilShopRouteIndex?.aetherytes || []).forEach(add);
  return Array.from(byId.values()).sort((left, right) => left.name.localeCompare(right.name, "zh-Hans-CN"));
}

function findAetheryteByQuery(query) {
  const text = String(query || "").trim().toLowerCase();
  if (!text) return null;
  const options = getRouteAetherytes();
  return options.find((item) => item.name.toLowerCase() === text)
    || options.find((item) => item.name.toLowerCase().includes(text))
    || null;
}

function getFilteredRouteAetherytes(query) {
  const text = String(query || "").trim().toLowerCase();
  const options = getRouteAetherytes();
  if (!text) return options;
  return options.filter((item) => {
    const fields = [
      item.name,
      item.placeName,
      item.aethernetName,
      item.referenceLabel,
    ].map((value) => String(value || "").toLowerCase());
    return fields.some((value) => value.includes(text));
  });
}

function renderRouteAetheryteMenu(query = "") {
  const options = getFilteredRouteAetherytes(query).slice(0, 80);
  if (!options.length) {
    return `<div class="wishlist-route-option is-empty">没有匹配的以太之光</div>`;
  }
  return options.map((item) => `
    <button class="wishlist-route-option" type="button" data-route-aetheryte-id="${escapeHtml(item.id)}">
      <span>${escapeHtml(item.name)}</span>
      ${item.placeName && item.placeName !== item.name && !item.name.includes(item.placeName) ? `<small>${escapeHtml(item.placeName)}</small>` : ""}
    </button>
  `).join("");
}

function syncRouteAetheryteMenu() {
  const input = document.getElementById("routeStartAetheryteInput");
  const menu = document.getElementById("routeAetheryteMenu");
  if (!input || !menu) return;
  window.clearTimeout(state.routeMenuHideTimer);
  menu.innerHTML = renderRouteAetheryteMenu(input.value);
  menu.hidden = false;
}

function selectRouteAetheryte(aetheryteId) {
  const input = document.getElementById("routeStartAetheryteInput");
  const menu = document.getElementById("routeAetheryteMenu");
  const selected = getRouteAetherytes().find((item) => item.id === String(aetheryteId));
  if (!input || !selected) return;
  window.clearTimeout(state.routeMenuHideTimer);
  state.selectedStartAetheryteId = selected.id;
  input.value = selected.name;
  if (menu) {
    menu.innerHTML = renderRouteAetheryteMenu(input.value);
    menu.hidden = false;
  }
}

function getTeleportCost(fromAetheryteId, toAetheryteId) {
  const from = String(fromAetheryteId || "");
  const to = String(toAetheryteId || "");
  if (!from || !to) return { cost: 999999, known: false };
  if (from === to) return { cost: 0, known: true };
  const costs = state.teleportCostIndex?.costs || {};
  const value = costs[from]?.[to] ?? costs[to]?.[from];
  const cost = Number(value);
  if (!Number.isFinite(cost)) return { cost: 999999, known: false };
  return { cost, known: true };
}

function getTeleportDistanceTier(cost, isCurrentStation) {
  if (isCurrentStation) return 0;
  if (cost <= 200) return 1;
  if (cost <= 500) return 2;
  if (cost <= 900) return 3;
  return 4;
}

function getWishlistRouteItems() {
  const indexItems = state.gilShopRouteIndex?.items || {};
  return getResolvedWishlistItems()
    .filter((item) => ["gearPieces", "accessoryPieces", "weaponPieces"].includes(item.engine))
    .map((item) => {
      const locations = (indexItems[String(item.id)] || [])
        .filter((location) => location.routePlannerEffectiveVendor !== false && Number(location.price) > 0);
      return { ...item, routeLocations: locations };
    })
    .filter((item) => item.routeLocations.length > 0);
}

function getStationKey(location) {
  return String(location.nearestAetheryteId || location.nearestAetheryteName || "");
}

function pickBetterLocation(left, right) {
  if (!left) return right;
  const leftPrice = Number(left.price) || 0;
  const rightPrice = Number(right.price) || 0;
  if (rightPrice !== leftPrice) return rightPrice < leftPrice ? right : left;
  if (right.routePlannerNearVendor !== left.routePlannerNearVendor) return right.routePlannerNearVendor ? right : left;
  return String(right.npcName || "").localeCompare(String(left.npcName || ""), "zh-Hans-CN") < 0 ? right : left;
}

function buildCandidateStations(remainingItems, currentAetheryteId) {
  const stations = new Map();
  remainingItems.forEach((item) => {
    const itemKey = getEntryKey(item.engine, item.id);
    item.routeLocations.forEach((location) => {
      const stationKey = getStationKey(location);
      if (!stationKey) return;
      if (!stations.has(stationKey)) {
        stations.set(stationKey, {
          key: stationKey,
          aetheryteId: String(location.nearestAetheryteId || ""),
          aetheryteName: location.nearestAetheryteName || "未知以太之光",
          postTeleportDirection: location.postTeleportDirection || "",
          itemLocations: new Map(),
        });
      }
      const station = stations.get(stationKey);
      const previous = station.itemLocations.get(itemKey);
      station.itemLocations.set(itemKey, {
        item,
        location: pickBetterLocation(previous?.location, location),
      });
    });
  });
  return Array.from(stations.values()).map((station) => {
    const isCurrentStation = String(station.aetheryteId || station.key) === String(currentAetheryteId);
    const teleport = getTeleportCost(currentAetheryteId, station.aetheryteId || station.key);
    const locations = Array.from(station.itemLocations.values()).map((entry) => entry.location);
    const convenienceRank = isCurrentStation ? 0 : locations.some((location) => location.routePlannerNearVendor) ? 1 : 2;
    return {
      ...station,
      isCurrentStation,
      teleportCost: teleport.cost,
      teleportCostKnown: teleport.known,
      distanceTier: getTeleportDistanceTier(teleport.cost, isCurrentStation),
      convenienceRank,
      buyCount: station.itemLocations.size,
      purchaseCost: Array.from(station.itemLocations.values()).reduce((sum, entry) => sum + (Number(entry.location.price) || 0), 0),
    };
  });
}

function compareCandidateStations(left, right) {
  const leftKey = [left.isCurrentStation ? 0 : 1, left.convenienceRank, left.distanceTier, -left.buyCount, left.teleportCost, left.aetheryteName];
  const rightKey = [right.isCurrentStation ? 0 : 1, right.convenienceRank, right.distanceTier, -right.buyCount, right.teleportCost, right.aetheryteName];
  for (let index = 0; index < leftKey.length; index += 1) {
    if (leftKey[index] < rightKey[index]) return -1;
    if (leftKey[index] > rightKey[index]) return 1;
  }
  return 0;
}

function buildWishlistPurchaseRoute(startAetheryte) {
  const routeItems = getWishlistRouteItems();
  const remaining = new Map(routeItems.map((item) => [getEntryKey(item.engine, item.id), item]));
  const stations = [];
  let currentAetheryteId = String(startAetheryte.id);
  let cumulativeTeleportCost = 0;
  let cumulativePurchaseCost = 0;
  let hasUnknownTeleportCost = false;

  while (remaining.size > 0) {
    const candidates = buildCandidateStations(Array.from(remaining.values()), currentAetheryteId).sort(compareCandidateStations);
    const selected = candidates[0];
    if (!selected) break;
    const purchases = Array.from(selected.itemLocations.values())
      .sort((left, right) => getWishlistName(left.item).localeCompare(getWishlistName(right.item), "zh-Hans-CN"));
    purchases.forEach((entry) => remaining.delete(getEntryKey(entry.item.engine, entry.item.id)));
    if (selected.teleportCostKnown) cumulativeTeleportCost += selected.teleportCost;
    else hasUnknownTeleportCost = true;
    cumulativePurchaseCost += selected.purchaseCost;
    stations.push({
      ...selected,
      purchases,
      cumulativeTeleportCost,
      cumulativePurchaseCost,
      cumulativeTotal: cumulativeTeleportCost + cumulativePurchaseCost,
      hasUnknownTeleportCost,
    });
    currentAetheryteId = selected.aetheryteId || selected.key;
  }

  return {
    startAetheryte,
    itemCount: routeItems.length,
    stations,
    teleportCost: cumulativeTeleportCost,
    purchaseCost: cumulativePurchaseCost,
    totalCost: cumulativeTeleportCost + cumulativePurchaseCost,
    hasUnknownTeleportCost,
  };
}

function formatGil(value) {
  return `${Number(value || 0).toLocaleString("zh-CN")} gil`;
}

function renderRoutePlan(plan) {
  if (!plan.itemCount) {
    return `<div class="wishlist-route-empty">当前愿望单里没有可规划 NPC 金币购买路线的物品。</div>`;
  }
  const totalText = plan.hasUnknownTeleportCost ? `${formatGil(plan.totalCost)} + 未知传送费` : formatGil(plan.totalCost);
  return `
    <div class="wishlist-route-summary">
      <span>可购买 <strong>${escapeHtml(plan.itemCount)}</strong> 件</span>
      <span>传送费 <strong>${escapeHtml(plan.hasUnknownTeleportCost ? `${formatGil(plan.teleportCost)} + 未知` : formatGil(plan.teleportCost))}</strong></span>
      <span>购买费 <strong>${escapeHtml(formatGil(plan.purchaseCost))}</strong></span>
      <span>合计 <strong>${escapeHtml(totalText)}</strong></span>
    </div>
    <div class="wishlist-route-stations">
      ${plan.stations.map((station, index) => renderRouteStation(station, index)).join("")}
    </div>
  `;
}

function renderRouteStation(station, index) {
  const npcGroups = new Map();
  station.purchases.forEach((entry) => {
    const location = entry.location;
    const key = [location.npcId, location.npcName, location.placeName, location.x, location.y].join("|");
    if (!npcGroups.has(key)) npcGroups.set(key, { location, entries: [] });
    npcGroups.get(key).entries.push(entry);
  });
  const teleportText = station.teleportCostKnown ? formatGil(station.teleportCost) : "费用未知";
  return `
    <section class="wishlist-route-station">
      <header class="wishlist-route-station__header">
        <div>
          <h3>第 ${index + 1} 站：${escapeHtml(station.aetheryteName)}${station.postTeleportDirection ? `<span class="wishlist-route-station__direction">位于传送点方位：${escapeHtml(station.postTeleportDirection)}</span>` : ""}</h3>
          <p>${station.isCurrentStation ? "当前起点" : `传送费 ${escapeHtml(teleportText)}`} / 本站购买 ${escapeHtml(formatGil(station.purchaseCost))}</p>
        </div>
        <span>${station.buyCount} 件</span>
      </header>
      <div class="wishlist-route-npc-list">
        ${Array.from(npcGroups.values()).map(({ location, entries }) => `
          <section class="wishlist-route-npc">
            <h4>${escapeHtml(location.npcName || "未知 NPC")}</h4>
            <p>${escapeHtml(location.placeName || "")}${location.x != null && location.y != null ? ` (X:${escapeHtml(location.x)} Y:${escapeHtml(location.y)})` : ""}${location.npcActualArea ? ` / ${escapeHtml(location.npcActualArea)}` : ""}</p>
            <ul>
              ${entries.map((entry) => `<li><span>${escapeHtml(getWishlistName(entry.item))}</span><strong>${escapeHtml(formatGil(entry.location.price))}</strong></li>`).join("")}
            </ul>
          </section>
        `).join("")}
      </div>
    </section>
  `;
}

function openWishlistRouteModal() {
  const options = getRouteAetherytes();
  const selected = options.find((item) => item.id === state.selectedStartAetheryteId) || options[0] || null;
  if (selected) state.selectedStartAetheryteId = selected.id;
  const initialPlan = selected ? buildWishlistPurchaseRoute(selected) : null;
  if (initialPlan) state.purchaseRoutePlan = initialPlan;
  openAppModal({
    title: "愿望单购买路径规划",
    subtitle: "默认从列表第一项开始规划，也可以改选你当前最近的以太之光",
    className: "app-modal--route-planner",
    body: `
      <div class="wishlist-route-controls">
        <label class="wishlist-route-search">
          <span>起点以太之光</span>
          <input id="routeStartAetheryteInput" class="wishlist-route-input" type="search" value="${escapeHtml(selected?.name || "")}" placeholder="输入以太之光名称" autocomplete="off" />
          <div id="routeAetheryteMenu" class="wishlist-route-menu" role="listbox" hidden>
            ${renderRouteAetheryteMenu(selected?.name || "")}
          </div>
        </label>
        <button class="app-modal-button app-modal-button--primary" type="button" data-modal-action="build-route-plan">开始规划</button>
      </div>
      <div id="wishlistRoutePlanResult" class="wishlist-route-result">
        ${initialPlan ? renderRoutePlan(initialPlan) : `<div class="wishlist-route-empty">没有可用的起点以太之光。</div>`}
      </div>
    `,
    footer: `<button class="app-modal-button" type="button" data-close-app-modal>关闭</button>`,
  });
}

function handleBuildRoutePlan() {
  const input = document.getElementById("routeStartAetheryteInput");
  const result = document.getElementById("wishlistRoutePlanResult");
  if (!input || !result) return;
  const startAetheryte = findAetheryteByQuery(input.value);
  if (!startAetheryte) {
    result.innerHTML = `<div class="wishlist-route-empty wishlist-route-empty--error">没有找到匹配的以太之光，请换一个关键词。</div>`;
    return;
  }
  const menu = document.getElementById("routeAetheryteMenu");
  if (menu) menu.hidden = true;
  state.selectedStartAetheryteId = String(startAetheryte.id);
  input.value = startAetheryte.name;
  const plan = buildWishlistPurchaseRoute(startAetheryte);
  state.purchaseRoutePlan = plan;
  result.innerHTML = renderRoutePlan(plan);
}

function setActivePieces(engine) {
  state.allItems = engine === "weaponPieces"
    ? state.allWeaponPieces
    : engine === "accessoryPieces"
      ? state.accessoryViewMode === "group"
        ? state.allAccessoryGroupItems
        : state.allAccessoryPieces
      : state.allArmorPieces;
  if (!getItemById(state.selectedItemId)) {
    const first = sortItems(state.allItems)[0] || state.allItems[0] || null;
    setSelectedItemId(first?.id ?? null);
  }
}

function setCurrentEngine(engine) {
  const next = [...BROWSE_ENGINES, ...COLLECTION_ENGINES].includes(engine) ? engine : "gearPieces";
  state.currentEngine = next;
  if (isPieceEngine(next)) setActivePieces(next);
  dom.appShell?.setAttribute("data-engine", next);
  dom.appShell?.setAttribute("data-wishlist-view", state.wishlistViewMode);
  dom.engineTabs.forEach((tab) => tab.classList.toggle("is-active", tab.dataset.engine === next));
  dom.topActionButtons.forEach((button) => button.classList.toggle("is-active", button.dataset.engine === next));
  const isWishlist = next === "wishlist";
  const isFavorites = next === "favorites";
  const isCollection = isCollectionEngine(next);
  const isGearSets = next === "gearSets";
  const isSeries = isSeriesEngine(next);
  const isAccessoryPieces = next === "accessoryPieces";
  const showWishlistDetail = isWishlist && state.wishlistViewMode === "detail";
  dom.filterToggle.hidden = isCollection;
  if (dom.accessoryViewToggle) dom.accessoryViewToggle.hidden = !isAccessoryPieces;
  syncAccessoryViewModeChrome();
  if (dom.wishlistToolbar) dom.wishlistToolbar.hidden = !isWishlist;
  dom.detailTop.hidden = isGearSets || isSeries || isFavorites || (isWishlist && !showWishlistDetail);
  dom.acquisitionRegion.hidden = isGearSets || isSeries || isFavorites || (isWishlist && !showWishlistDetail);
  dom.gearSetsDetailView.hidden = !(isGearSets || isSeries);
  const filterText = dom.filterToggle.querySelector("span");
  if (filterText) filterText.textContent = isGearSets ? "套装搜索条件" : isSeries ? `${ENGINE_LABELS[next]}搜索条件` : `${getPieceLabel(next)}搜索条件`;
  if (dom.dresserFilterLabel) dom.dresserFilterLabel.textContent = next === "weaponPieces" ? "加入投影台" : "成套加入投影台";
  syncGenderTabs();
  renderFilterOptions();
  setFilterDropdownOpen(false);
  applyFiltersAndRender();
}

function setFilterDropdownOpen(open) {
  if (!dom.filterDropdown) return;
  dom.filterDropdown.hidden = !open;
  dom.filterToggle?.setAttribute("aria-expanded", String(open));
}

function resetFilters() {
  [dom.searchInput, dom.minItemLevelInput, dom.maxItemLevelInput, dom.minEquipLevelInput, dom.maxEquipLevelInput].forEach((input) => { if (input) input.value = ""; });
  [dom.armorOnly, dom.accessoryOnly, dom.recommendedOnly, dom.dresserSetOnly, dom.dresserSetOffOnly, dom.armoireOnly, dom.armoireOffOnly, dom.sameModelOnly, dom.sameModelOffOnly, dom.marketOnly, dom.dualDyeOnly, dom.dyeOnly, dom.noDyeOnly, dom.crestOnly].forEach((input) => { if (input) input.checked = false; });
  if (dom.sortFilter) dom.sortFilter.value = "default";
  renderFilterOptions();
}

function syncActionButtons() {
  document.querySelectorAll("[data-wishlist-toggle]").forEach((button) => {
    const key = getActionButtonKey(button);
    const active = collectionHasAll(state.wishlistIds, key);
    button.classList.toggle("is-active", active);
    button.setAttribute("aria-pressed", String(active));
  });
  document.querySelectorAll("[data-favorite-toggle]").forEach((button) => {
    const key = getActionButtonKey(button);
    const active = collectionHasAll(state.favoriteIds, key);
    button.classList.toggle("is-active", active);
    button.setAttribute("aria-pressed", String(active));
  });
}

function getActionButtonKey(button) {
  if (button?.dataset?.itemId) return button.dataset.itemId;
  if (state.currentEngine === "gearSets" && state.selectedGearSet) return getGearSetKey(state.selectedGearSet);
  if (isSeriesEngine(state.currentEngine) && state.selectedSeries) return getSeriesKey(state.selectedSeries);
  const item = getItemById(state.selectedItemId);
  return item ? getItemKey(item) : "";
}

function closeAppModal() {
  document.querySelector(".app-modal-overlay")?.remove();
}

function closeImageViewer() {
  document.querySelector(".image-viewer-overlay")?.remove();
  state.imageViewerZoom = 1;
  state.imageViewerPanX = 0;
  state.imageViewerPanY = 0;
  state.imageViewerDragging = null;
}

function syncImageViewerZoom() {
  const overlay = document.querySelector(".image-viewer-overlay");
  const image = overlay?.querySelector(".image-viewer-image");
  const input = overlay?.querySelector(".image-viewer-zoom-input");
  if (!image) return;
  const zoom = Math.min(3, Math.max(0.5, Number(state.imageViewerZoom) || 1));
  state.imageViewerZoom = zoom;
  if (zoom <= 1) {
    state.imageViewerPanX = 0;
    state.imageViewerPanY = 0;
  }
  image.style.transform = `translate(${state.imageViewerPanX}px, ${state.imageViewerPanY}px) scale(${zoom})`;
  image.style.transformOrigin = "center center";
  image.style.cursor = zoom > 1 ? "grab" : "zoom-in";
  if (input) input.value = String(Math.round(zoom * 100));
}

function resetImageViewerPan() {
  state.imageViewerPanX = 0;
  state.imageViewerPanY = 0;
}

function openImageViewer(src, caption = "") {
  if (!src) return;
  closeImageViewer();
  state.imageViewerZoom = 1;
  const overlay = document.createElement("div");
  overlay.className = "image-viewer-overlay";
  overlay.setAttribute("role", "dialog");
  overlay.setAttribute("aria-modal", "true");
  overlay.setAttribute("aria-label", "图片预览");
  overlay.innerHTML = `
    <button class="image-viewer-close" type="button" data-close-image-viewer aria-label="关闭">×</button>
    <div class="image-viewer-toolbar" aria-label="缩放控制">
      <button type="button" data-image-viewer-action="zoom-out">−</button>
      <label class="image-viewer-zoom-input-wrap">
        <input class="image-viewer-zoom-input" type="number" min="50" max="300" step="10" value="100" aria-label="缩放比例" />%
      </label>
      <button type="button" data-image-viewer-action="zoom-in">＋</button>
      <button type="button" data-image-viewer-action="reset">重置</button>
    </div>
    <img class="image-viewer-image" src="${escapeHtml(src)}" alt="${escapeHtml(caption || "图片预览")}" />
    ${caption ? `<div class="image-viewer-caption">${escapeHtml(caption)}</div>` : ""}
  `;
  overlay.addEventListener("click", (event) => {
    if (event.target === overlay || event.target.closest("[data-close-image-viewer]")) {
      closeImageViewer();
      return;
    }
    const action = event.target.closest("[data-image-viewer-action]")?.dataset.imageViewerAction;
    if (action === "zoom-in") state.imageViewerZoom += 0.25;
    if (action === "zoom-out") state.imageViewerZoom -= 0.25;
    if (action === "reset") {
      state.imageViewerZoom = 1;
      resetImageViewerPan();
    }
    if (action) syncImageViewerZoom();
    if (event.target.closest(".image-viewer-image")) {
      if (state.imageViewerDragging?.moved) {
        state.imageViewerDragging = null;
        return;
      }
      state.imageViewerZoom = state.imageViewerZoom > 1 ? 1 : 2;
      resetImageViewerPan();
      syncImageViewerZoom();
      state.imageViewerDragging = null;
    }
  });
  overlay.addEventListener("input", (event) => {
    if (!event.target.classList.contains("image-viewer-zoom-input")) return;
    state.imageViewerZoom = Number(event.target.value) / 100;
    syncImageViewerZoom();
  });
  overlay.addEventListener("pointerdown", (event) => {
    const image = event.target.closest(".image-viewer-image");
    if (!image || state.imageViewerZoom <= 1) return;
    event.preventDefault();
    image.setPointerCapture?.(event.pointerId);
    image.style.cursor = "grabbing";
    state.imageViewerDragging = {
      pointerId: event.pointerId,
      startX: event.clientX,
      startY: event.clientY,
      panX: state.imageViewerPanX,
      panY: state.imageViewerPanY,
      moved: false,
    };
  });
  overlay.addEventListener("pointermove", (event) => {
    const drag = state.imageViewerDragging;
    if (!drag || drag.pointerId !== event.pointerId) return;
    const deltaX = event.clientX - drag.startX;
    const deltaY = event.clientY - drag.startY;
    if (Math.abs(deltaX) > 3 || Math.abs(deltaY) > 3) drag.moved = true;
    state.imageViewerPanX = drag.panX + deltaX;
    state.imageViewerPanY = drag.panY + deltaY;
    syncImageViewerZoom();
  });
  overlay.addEventListener("pointerup", (event) => {
    const image = overlay.querySelector(".image-viewer-image");
    image?.releasePointerCapture?.(event.pointerId);
    if (image && state.imageViewerZoom > 1) image.style.cursor = "grab";
  });
  overlay.addEventListener("pointercancel", (event) => {
    const image = overlay.querySelector(".image-viewer-image");
    image?.releasePointerCapture?.(event.pointerId);
    state.imageViewerDragging = null;
    if (image && state.imageViewerZoom > 1) image.style.cursor = "grab";
  });
  document.body.appendChild(overlay);
  syncImageViewerZoom();
  overlay.querySelector("[data-close-image-viewer]")?.focus();
}

function openPreviewImageFromElement(image) {
  if (!(image instanceof HTMLImageElement) || image.classList.contains("is-empty")) return;
  const src = image.currentSrc || image.src || image.getAttribute("src");
  if (!src || src.startsWith("data:image/gif")) return;
  openImageViewer(src, image.alt || "");
}

function openAppModal({ title, subtitle = "", body = "", footer = "", className = "" }) {
  closeAppModal();
  const overlay = document.createElement("div");
  overlay.className = "app-modal-overlay";
  overlay.setAttribute("role", "presentation");
  overlay.innerHTML = `
    <section class="app-modal ${className}" role="dialog" aria-modal="true" aria-labelledby="appModalTitle">
      <header class="app-modal__header">
        <div>
          <h2 id="appModalTitle">${escapeHtml(title)}</h2>
          ${subtitle ? `<p>${escapeHtml(subtitle)}</p>` : ""}
        </div>
        <button class="app-modal__close" type="button" data-close-app-modal aria-label="关闭">×</button>
      </header>
      <div class="app-modal__body">${body}</div>
      <footer class="app-modal__footer">
        ${footer || `<button class="app-modal-button app-modal-button--primary" type="button" data-close-app-modal>知道了</button>`}
      </footer>
    </section>
  `;
  overlay.addEventListener("click", (event) => {
    if (event.target === overlay || event.target.closest("[data-close-app-modal]")) closeAppModal();
  });
  document.body.appendChild(overlay);
  overlay.querySelector("[data-close-app-modal]")?.focus();
}

function markdownToHtml(markdown) {
  const lines = String(markdown || "").replace(/\r\n/g, "\n").split("\n");
  const html = [];
  let inList = false;
  const closeList = () => {
    if (inList) {
      html.push("</ul>");
      inList = false;
    }
  };
  const inline = (text) => escapeHtml(text)
    .replace(/`([^`]+)`/g, "<code>$1</code>")
    .replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>");

  lines.forEach((line) => {
    const text = line.trim();
    if (!text) {
      closeList();
      return;
    }
    const heading = text.match(/^(#{1,4})\s+(.+)$/);
    if (heading) {
      closeList();
      const level = Math.min(heading[1].length + 1, 4);
      html.push(`<h${level}>${inline(heading[2])}</h${level}>`);
      return;
    }
    const bullet = text.match(/^[-*]\s+(.+)$/);
    if (bullet) {
      if (!inList) {
        html.push("<ul>");
        inList = true;
      }
      html.push(`<li>${inline(bullet[1])}</li>`);
      return;
    }
    closeList();
    html.push(`<p>${inline(text)}</p>`);
  });
  closeList();
  return html.join("");
}

async function openMarkdownModal(title, markdownPath) {
  openAppModal({
    title,
    body: `<p>正在加载内容。</p>`,
    className: "app-modal--markdown",
  });
  try {
    const response = await fetch(markdownPath, { cache: "no-store" });
    if (!response.ok) throw new Error(`${markdownPath} ${response.status}`);
    const markdown = await response.text();
    openAppModal({
      title,
      body: markdownToHtml(markdown),
      className: "app-modal--markdown",
    });
  } catch {
    openAppModal({
      title,
      body: `<p class="app-info-error">内容加载失败，请检查 <code>${escapeHtml(markdownPath)}</code>。</p>`,
      className: "app-modal--markdown",
    });
  }
}

function getDataStats() {
  return {
    gearPieces: state.allArmorPieces.length,
    accessoryPieces: state.allAccessoryPieces.length,
    gearSets: state.allGearSets.length,
    weaponPieces: state.allWeaponPieces.length,
    wishlist: getResolvedWishlistItems().length,
    favorites: state.favoriteIds.size,
  };
}

function openNoticeModal() {
  openMarkdownModal("Changelog / 反馈渠道", "docs/changelog-feedback.md");
}

function openHelpModal() {
  openMarkdownModal("Q&A", "docs/qa.md");
}

function openSettingsModal() {
  const imageGenderPreference = normalizeImageGenderPreference(state.imageGenderPreference);
  const recommendationMode = normalizeRecommendationMode(state.appSettings.recommendationMode);
  const cleanupReplacedItems = Boolean(state.appSettings.cleanupReplacedItems);
  openAppModal({
    title: "设置",
    subtitle: "这些设置保存在本机浏览器里",
    className: "app-modal--settings",
    body: `
      <fieldset class="settings-fieldset">
        <legend>愿望单推荐</legend>
        <label class="settings-option"><input type="radio" name="recommendMode" value="ask" ${recommendationMode === "ask" ? "checked" : ""}> 询问是否使用推荐替代</label>
        <label class="settings-option"><input type="radio" name="recommendMode" value="auto" ${recommendationMode === "auto" ? "checked" : ""}> 自动使用推荐替代</label>
        <label class="settings-option"><input type="radio" name="recommendMode" value="off" ${recommendationMode === "off" ? "checked" : ""}> 关闭推荐替代</label>
        <label class="settings-option"><input type="checkbox" id="appSettingsCleanup" ${cleanupReplacedItems ? "checked" : ""}> 加入推荐时清除已添加的被替代选项</label>
      </fieldset>
      <fieldset class="settings-fieldset">
        <legend>图片性别偏好</legend>
        <label class="settings-option"><input type="radio" name="imageGenderPreference" value="none" ${imageGenderPreference === "none" ? "checked" : ""}> 无偏好</label>
        <label class="settings-option"><input type="radio" name="imageGenderPreference" value="male" ${imageGenderPreference === "male" ? "checked" : ""}> 男</label>
        <label class="settings-option"><input type="radio" name="imageGenderPreference" value="female" ${imageGenderPreference === "female" ? "checked" : ""}> 女</label>
      </fieldset>
      <fieldset class="settings-fieldset">
        <legend>本地清单</legend>
        <p>愿望单和收藏只存储在当前浏览器的 localStorage。</p>
        <button class="app-modal-button" type="button" data-modal-action="clear-wishlist">清空愿望单</button>
        <button class="app-modal-button" type="button" data-modal-action="clear-favorites">清空收藏</button>
      </fieldset>
    `,
    footer: `
      <button class="app-modal-button" type="button" data-close-app-modal>取消</button>
      <button class="app-modal-button" type="button" data-modal-action="reset-settings">恢复默认</button>
      <button class="app-modal-button app-modal-button--primary" type="button" data-modal-action="save-settings">保存</button>
    `,
  });
}

function navigateToWishlistEntity(engine, id) {
  if (engine === "gearSets" || engine === "customGearSets") {
    const setEntity = getGearSetByKey(getEntryKey(engine, id));
    if (setEntity) state.selectedGearSet = setEntity;
    resetFilters();
    setCurrentEngine("gearSets");
  } else if (engine === "gearSeries" || engine === "weaponSeries") {
    const seriesEntity = getSeriesByKey(getEntryKey(engine, id));
    if (seriesEntity) state.selectedSeries = seriesEntity;
    resetFilters();
    setCurrentEngine(engine);
  } else if (engine === "gearPieces" || engine === "accessoryPieces" || engine === "weaponPieces") {
    resetFilters();
    setCurrentEngine(engine);
    setSelectedItemId(id);
    applyFiltersAndRender();
  }
}

function bindEvents() {
  document.addEventListener("error", (event) => {
    if (!(event.target instanceof HTMLImageElement)) return;
    if (handlePreviewImageError(event.target)) return;
    handleIconImageError(event.target);
  }, true);
  dom.engineTabs.forEach((tab) => tab.addEventListener("click", () => setCurrentEngine(tab.dataset.engine)));
  dom.topActionButtons.forEach((button) => button.addEventListener("click", () => setCurrentEngine(button.dataset.engine)));
  dom.appNoticeButton?.addEventListener("click", openNoticeModal);
  dom.appHelpButton?.addEventListener("click", openHelpModal);
  dom.appSettingsButton?.addEventListener("click", openSettingsModal);
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      if (document.querySelector(".image-viewer-overlay")) closeImageViewer();
      else closeAppModal();
    }
  });
  document.addEventListener("click", (event) => {
    const previewImage = event.target.closest(".preview-image, .gear-sets-preview-image");
    if (previewImage) {
      openPreviewImageFromElement(previewImage);
      return;
    }
    const action = event.target.closest("[data-modal-action]")?.dataset.modalAction;
    if (action === "clear-wishlist") {
      setWishlistData({ version: 1, items: [] });
      renderWishlistList();
      renderCurrentFilters();
      openSettingsModal();
    }
    if (action === "clear-favorites") {
      state.favoriteIds = new Set();
      setStorageJson(FAVORITE_STORAGE_KEY, []);
      syncActionButtons();
      openSettingsModal();
    }
    if (action === "save-settings") {
      const overlay = event.target.closest(".app-modal-overlay");
      const recommendationInput = overlay?.querySelector("input[name='recommendMode']:checked");
      const cleanupInput = overlay?.querySelector("#appSettingsCleanup");
      const imageInput = overlay?.querySelector("input[name='imageGenderPreference']:checked");
      persistAppSettings({
        recommendationMode: recommendationInput?.value,
        cleanupReplacedItems: Boolean(cleanupInput?.checked),
      });
      if (imageInput) persistImageGenderPreference(imageInput.value);
      closeAppModal();
    }
    if (action === "reset-settings") {
      persistAppSettings(DEFAULT_APP_SETTINGS);
      persistImageGenderPreference("none");
      openSettingsModal();
    }
    if (action === "build-route-plan") {
      handleBuildRoutePlan();
    }
    if (event.target?.id === "routeStartAetheryteInput") {
      syncRouteAetheryteMenu();
    }
    const routeOption = event.target.closest("[data-route-aetheryte-id]");
    if (routeOption) {
      selectRouteAetheryte(routeOption.dataset.routeAetheryteId);
    }
  });
  document.addEventListener("input", (event) => {
    if (event.target?.id === "routeStartAetheryteInput") {
      state.selectedStartAetheryteId = "";
      syncRouteAetheryteMenu();
    }
  });
  document.addEventListener("change", (event) => {
    if (event.target?.name !== "imageGenderPreference") return;
    persistImageGenderPreference(event.target.value);
    if (state.imageGenderPreference === "none" && getCurrentPreviewGenders().length > 1) {
      state.manualGender = state.gender;
    }
    if (state.currentEngine === "gearSets") {
      renderGearSetDetail();
    } else {
      applyImageGenderPreferenceForCurrentItem();
      syncGenderTabs();
      syncPreviewImage();
    }
  });
  document.addEventListener("focusin", (event) => {
    if (event.target?.id === "routeStartAetheryteInput") {
      syncRouteAetheryteMenu();
    }
  });
  document.addEventListener("focusout", (event) => {
    if (event.target?.id !== "routeStartAetheryteInput") return;
    window.clearTimeout(state.routeMenuHideTimer);
    state.routeMenuHideTimer = window.setTimeout(() => {
      const active = document.activeElement;
      if (active?.id === "routeStartAetheryteInput") return;
      if (active?.closest?.("#routeAetheryteMenu")) return;
      const menu = document.getElementById("routeAetheryteMenu");
      if (menu) menu.hidden = true;
    }, 120);
  });
  dom.filterToggle?.addEventListener("click", (event) => {
    event.stopPropagation();
    setFilterDropdownOpen(dom.filterDropdown.hidden);
  });
  dom.filterDropdown?.addEventListener("click", (event) => event.stopPropagation());
  document.addEventListener("click", () => setFilterDropdownOpen(false));
  document.getElementById("applyFilters")?.addEventListener("click", () => {
    applyFiltersAndRender();
    setFilterDropdownOpen(false);
  });
  document.getElementById("resetFilters")?.addEventListener("click", () => { resetFilters(); applyFiltersAndRender(); });
  dom.sourceFilter?.addEventListener("change", renderFilterOptions);
  dom.armorOnly?.addEventListener("change", renderFilterOptions);
  dom.accessoryOnly?.addEventListener("change", renderFilterOptions);
  dom.accessoryModeButtons.forEach((button) => button.addEventListener("click", () => {
    state.accessoryViewMode = button.dataset.accessoryViewMode === "piece" ? "piece" : "group";
    syncAccessoryViewModeChrome();
    setActivePieces("accessoryPieces");
    renderFilterOptions();
    applyFiltersAndRender();
  }));
  dom.wishlistViewToggle?.addEventListener("click", (event) => {
    const button = event.target.closest("[data-wishlist-view-mode]");
    if (!button) return;
    state.wishlistViewMode = button.dataset.wishlistViewMode === "detail" ? "detail" : "list";
    setCurrentEngine("wishlist");
  });
  dom.wishlistInstanceStatsButton?.addEventListener("click", openWishlistInstanceStatsModal);
  dom.wishlistRoutePlanButton?.addEventListener("click", openWishlistRouteModal);
  dom.genderTabs.forEach((tab) => tab.addEventListener("click", () => {
    state.gender = tab.dataset.gender;
    state.manualGender = state.gender;
    syncGenderTabs();
    syncPreviewImage();
  }));
  dom.dyeTabs.forEach((tab) => tab.addEventListener("click", () => { state.dye = tab.dataset.dye; syncPreviewImage(); syncDyeTabs(); }));
  dom.resultList.addEventListener("click", (event) => {
    const loadMore = event.target.closest("[data-load-more-results]");
    if (loadMore) {
      state.visibleItemCount += RESULT_LOAD_MORE_STEP;
      if (state.currentEngine === "gearSets") renderGearSetResultCards();
      else if (isSeriesEngine(state.currentEngine)) renderSeriesResultCards();
      else renderResultCards();
      renderCurrentFilters();
      return;
    }
    const wishlist = event.target.closest("[data-wishlist-toggle]");
    if (wishlist) {
      event.stopPropagation();
      handleWishlistToggle(wishlist.dataset.itemId);
      return;
    }
    const favorite = event.target.closest("[data-favorite-toggle]");
    if (favorite) {
      event.stopPropagation();
      toggleFavorite(favorite.dataset.itemId);
      syncActionButtons();
      if (state.currentEngine === "favorites") {
        renderFavoritesList();
        renderCurrentFilters();
      }
      return;
    }
    if (state.currentEngine === "wishlist") {
      const remove = event.target.closest("[data-wishlist-remove]");
      if (remove) {
        removeWishlistEntry(remove.dataset.wishlistRemove, remove.dataset.wishlistId);
        renderWishlistList();
        renderCurrentFilters();
        return;
      }
      const acquired = event.target.closest("[data-wishlist-acquired]");
      if (acquired) {
        updateWishlistEntry(acquired.dataset.wishlistAcquired, acquired.dataset.wishlistId, { status: acquired.dataset.wishlistStatus === "acquired" ? "wanted" : "acquired" });
        renderWishlistList();
        return;
      }
      const card = state.wishlistViewMode === "detail" ? event.target.closest("[data-wishlist-select]") : null;
      if (card && !event.target.closest("button")) {
        state.selectedWishlistKey = card.dataset.wishlistSelect;
        renderWishlistList();
      }
      return;
    }
    if (state.currentEngine === "gearSets") {
      const card = event.target.closest(".gear-sets-result-card[data-set-engine][data-set-id]");
      if (!card) return;
      state.selectedGearSet = getGearSetByKey(getEntryKey(card.dataset.setEngine, card.dataset.setId)) || state.selectedGearSet;
      state.previewGearSetKey = null;
      state.previewGearSetPieceId = null;
      renderGearSetResultCards();
      renderGearSetDetail();
      return;
    }
    if (isSeriesEngine(state.currentEngine)) {
      const card = event.target.closest(".gear-sets-result-card[data-series-engine][data-series-id]");
      if (!card) return;
      state.selectedSeries = getSeriesByKey(getEntryKey(card.dataset.seriesEngine, card.dataset.seriesId)) || state.selectedSeries;
      renderSeriesResultCards();
      renderSeriesDetail();
      return;
    }
    if (state.currentEngine === "favorites") {
      const card = event.target.closest("[data-favorite-select]");
      if (!card || event.target.closest("button")) return;
      const { engine, id } = parseEntryKey(card.dataset.favoriteSelect);
      navigateToWishlistEntity(engine, id);
      return;
    }
    const card = event.target.closest(".result-card[data-item-id], .accessory-pieces-result-card[data-item-id], .weapon-pieces-result-card[data-item-id]");
    if (!card) return;
    setSelectedItemId(card.dataset.itemId);
    renderResultCards();
    renderDetail();
  });
  document.querySelector(".detail-region").addEventListener("click", (event) => {
    const racePreview = event.target.closest("[data-preview-race]");
    if (racePreview) {
      persistPreviewRace(racePreview.dataset.previewRace);
      const item = getItemById(state.previewItemId) || getItemById(state.selectedItemId);
      syncRacePreviewPanel(item);
      syncPreviewImage();
      return;
    }
    const wishlist = event.target.closest("[data-wishlist-toggle]");
    if (wishlist) {
      handleWishlistToggle(getActionButtonKey(wishlist));
      return;
    }
    const favorite = event.target.closest("[data-favorite-toggle]");
    if (favorite) {
      toggleFavorite(getActionButtonKey(favorite));
      syncActionButtons();
      return;
    }
    const navigateSet = event.target.closest("[data-navigate-set-engine][data-navigate-set-id]");
    if (navigateSet) {
      state.selectedGearSet = getGearSetByKey(getEntryKey(navigateSet.dataset.navigateSetEngine, navigateSet.dataset.navigateSetId)) || state.selectedGearSet;
      setCurrentEngine("gearSets");
      return;
    }
    const navigateSeries = event.target.closest("[data-navigate-series-engine][data-navigate-series-id]");
    if (navigateSeries) {
      state.selectedSeries = getSeriesByKey(getEntryKey(navigateSeries.dataset.navigateSeriesEngine, navigateSeries.dataset.navigateSeriesId)) || state.selectedSeries;
      setCurrentEngine(navigateSeries.dataset.navigateSeriesEngine);
      return;
    }
    const navigateItem = event.target.closest("[data-navigate-item-id]");
    if (navigateItem) {
      const target = getPieceById(navigateItem.dataset.navigateItemId);
      if (!target) return;
      setCurrentEngine(getItemEngine(target));
      setSelectedItemId(target.id);
      applyFiltersAndRender();
      return;
    }
    const preview = event.target.closest("[data-preview-item-id]");
    if (preview) {
      setPreviewItemId(preview.dataset.previewItemId);
      syncDyeTabs();
      syncPreviewImage();
      const selected = getItemById(state.selectedItemId);
      if (selected) dom.sameModelTableBody.innerHTML = renderSameModelRows(selected);
      return;
    }
    const setPreview = event.target.closest("[data-set-preview-item-id]");
    if (setPreview) {
      state.previewGearSetPieceId = Number(setPreview.dataset.setPreviewItemId);
      state.previewGearSetKey = null;
      renderGearSetDetail();
      return;
    }
    const previewSet = event.target.closest("[data-preview-set-key]");
    if (previewSet) {
      state.previewGearSetKey = previewSet.dataset.previewSetKey;
      state.previewGearSetPieceId = null;
      renderGearSetDetail();
      return;
    }
    const setDye = event.target.closest("[data-set-dye]");
    if (setDye) {
      state.dye = setDye.dataset.setDye;
      if (isSeriesEngine(state.currentEngine)) renderSeriesDetail();
      else renderGearSetDetail();
      return;
    }
    const setGender = event.target.closest("[data-set-gender]");
    if (setGender) {
      state.gender = setGender.dataset.setGender;
      state.manualGender = state.gender;
      if (isSeriesEngine(state.currentEngine)) renderSeriesDetail();
      else renderGearSetDetail();
    }
  });
}

async function init() {
  try {
    dom.resultList.innerHTML = `<div class="empty-result"><p>正在加载 V2 数据。</p></div>`;
    const [armorData, accessoryData, weaponData, officialSets, customSets, gearSeriesData, weaponSeriesData, sourceTaxonomy, gilShopRouteIndex, teleportCostIndex, instanceTokenSourceMap, sameModelOnlyData] = await Promise.all([
      loadJson("generated/source-v2-armor-data.json"),
      loadJson("generated/source-v2-accessory-data.json"),
      loadJson("generated/source-v2-weapon-data.json"),
      loadJson("generated/mirage-store-sets.json"),
      loadJson("custom-gear-sets.json"),
      loadJson("gear-series.json"),
      loadJson("weapon-series.json"),
      loadJson("generated/source-taxonomy-v2.draft.json").catch(() => null),
      loadJson("generated/gil-shop-route-index.json"),
      loadJson("generated/teleport-cost-index.json"),
      loadJson("generated/instance-token-source-map.json"),
      loadJson("generated/same-model-only-blacklisted-items.json").catch(() => []),
    ]);
    state.sourceTaxonomy = sourceTaxonomy;
    state.gilShopRouteIndex = gilShopRouteIndex;
    state.teleportCostIndex = teleportCostIndex;
    state.instanceTokenSourceMap = instanceTokenSourceMap;
    state.tokenInstanceLookup = null;
    state.allArmorPieces = normalizeListData(armorData).map(adaptPiece).filter(isVisibleItem);
    state.allAccessoryPieces = attachAccessoryGroupIds(normalizeListData(accessoryData).map(adaptPiece).filter(isVisibleItem));
    state.allGearPieces = [...state.allArmorPieces, ...state.allAccessoryPieces];
    state.allAccessoryGroupItems = buildAccessoryGroupItems(state.allAccessoryPieces);
    state.allWeaponPieces = normalizeListData(weaponData).map(adaptPiece).filter(isVisibleItem);
    state.sameModelOnlyItems = normalizeListData(sameModelOnlyData).map((item) => ({
      ...adaptPiece(item),
      sameModelOnly: true,
    }));
    state.sameModelOnlyItemsById = new Map(state.sameModelOnlyItems.map((item) => [String(item.id), item]));
    state.gearPiecesById = new Map(state.allGearPieces.map((item) => [String(item.id), item]));
    state.weaponPiecesById = new Map(state.allWeaponPieces.map((item) => [String(item.id), item]));
    state.officialGearSets = Array.isArray(officialSets) ? officialSets : [];
    state.customGearSets = Array.isArray(customSets?.sets) ? customSets.sets : [];
    state.allGearSets = buildGearSets();
    buildSeries(gearSeriesData, weaponSeriesData);
    syncAppSettings();
    syncWishlistIds();
    syncFavoriteIds();
    syncImageGenderPreference();
    syncPreviewRace();
    bindEvents();
    setCurrentEngine("gearPieces");
  } catch (error) {
    console.error(error);
    dom.resultList.innerHTML = `<div class="empty-result"><p>数据加载失败。</p><p class="empty-result-tip">${escapeHtml(error.message || String(error))}</p></div>`;
  }
}

init();
