let items = [];
let mirageSets = [];
let customGearSets = [];
let gearSeries = [];
let gearSetModelLinks = [];
let weaponItems = [];
let weaponSeries = [];
let entityRegistry = {};
let gearItemsBySetId = {};
let gearItemsByCustomSetId = {};
let gearItemsByModelKey = {};
let weaponItemsByModelKey = {};
let gilShopRouteIndex = null;
let gilShopRouteIndexPromise = null;
let teleportCostIndex = null;
let teleportCostIndexPromise = null;
let battleContentAliasIndex = null;
let battleContentAliasIndexPromise = null;
let battleCofferIndex = null;
let battleCofferIndexPromise = null;
let recipeCraftIndex = null;
let recipeCraftIndexPromise = null;
let npcLocationIndex = null;
let npcLocationIndexPromise = null;
let activeGilRouteExcludedItemIds = new Set();
let currentEngine = "gearPieces";
let selectedSetRoute = null;
let selectedSeriesId = null;
let selectedWeaponId = null;
let _allGearSetListItems = null;
let gearSetSimilarItemsByKey = new Map();
let gearSetRecommendedKeys = new Set();
let gearSetRecommendationScoreByKey = new Map();
let gearSetArmorKeysByKey = new Map();
const SHOW_DATA_NOTES = false;
const RUN_BROWSER_DATA_VALIDATION = false;
const CACHE_DETAIL_HTML = false;
const DISABLE_LIVE_SERVER_AUTO_RELOAD = true;
const VALID_ITEM_TYPES = ["套装", "散件"];

const VALID_EQUIP_SLOTS = [
  "套装",
  "头部",
  "身体",
  "手部",
  "腿部",
  "脚部",
  "耳饰",
  "项链",
  "手镯",
  "戒指"
];
const EQUIP_SLOT_ORDER = VALID_EQUIP_SLOTS.filter(slot => slot !== "套装");
const ARMOR_EQUIP_SLOTS = ["头部", "身体", "手部", "腿部", "脚部"];

const VALID_SOURCE_TYPES = [
  "制作",
  "NPC购买",
  "NPC兑换",
  "副本掉落",
  "讨伐歼灭战",
  "大型任务",
  "任务奖励",
  "成就奖励",
  "金碟兑换",
  "PVP兑换",
  "季节活动",
  "商城",
  "探索玩法",
  "其他"
];

const searchInput = document.getElementById("searchInput");
const equipSlotFilter = document.getElementById("equipSlotFilter");
const weaponTypeFilter = document.getElementById("weaponTypeFilter");
const armorOnly = document.getElementById("armorOnly");
const accessoryOnly = document.getElementById("accessoryOnly");
const weaponSlotFilterRow = document.getElementById("weaponSlotFilterRow");
const mainHandOnly = document.getElementById("mainHandOnly");
const offHandOnly = document.getElementById("offHandOnly");
const minItemLevelInput = document.getElementById("minItemLevelInput");
const maxItemLevelInput = document.getElementById("maxItemLevelInput");
const minEquipLevelInput = document.getElementById("minEquipLevelInput");
const maxEquipLevelInput = document.getElementById("maxEquipLevelInput");
const sourceFilter = document.getElementById("sourceFilter");
const gearPieceCategoryFilterRow = document.getElementById("gearPieceCategoryFilterRow");
const gearSetFilters = document.getElementById("gearSetFilters");
const gearSetSourceCategoryFilter = document.getElementById("gearSetSourceCategoryFilter");
const gearSetSourceSubcategoryFilter = document.getElementById("gearSetSourceSubcategoryFilter");
const gearSetSourceDetailFilter = document.getElementById("gearSetSourceDetailFilter");
const gearSetDresserSetOnly = document.getElementById("gearSetDresserSetOnly");
const gearSetLooseOnly = document.getElementById("gearSetLooseOnly");
const gearSetArmoireOnly = document.getElementById("gearSetArmoireOnly");
const gearSetNotArmoireOnly = document.getElementById("gearSetNotArmoireOnly");
const gearSetHasModelLinksOnly = document.getElementById("gearSetHasModelLinksOnly");
const gearSetNoModelLinksOnly = document.getElementById("gearSetNoModelLinksOnly");
const sortFilter = document.getElementById("sortFilter");
const marketOnly = document.getElementById("marketOnly");
const marketOnlyFilterLabel = document.getElementById("marketOnlyFilterLabel");
const noDyeOnly = document.getElementById("noDyeOnly");
const dyeOnly = document.getElementById("dyeOnly");
const dualDyeOnly = document.getElementById("dualDyeOnly");
const dresserOnly = document.getElementById("dresserOnly");
const dresserSetOnly = document.getElementById("dresserSetOnly");
const armoireOnly = document.getElementById("armoireOnly");
const crestOnly = document.getElementById("crestOnly");
const pieceGlamourFilterGroup = document.getElementById("pieceGlamourFilterGroup");
const dresserOnlyFilterLabel = document.getElementById("dresserOnlyFilterLabel");
const dresserSetOnlyFilterLabel = document.getElementById("dresserSetOnlyFilterLabel");
const armoireOnlyFilterLabel = document.getElementById("armoireOnlyFilterLabel");
const crestOnlyFilterLabel = document.getElementById("crestOnlyFilterLabel");
const dyeScopeNote = document.getElementById("dyeScopeNote");
const applyFilterButton = document.getElementById("applyFilterButton");
const resetButton = document.getElementById("resetButton");
const resultList = document.getElementById("resultList");
const resultCount = document.getElementById("resultCount");
const loadMoreButton = document.getElementById("loadMoreButton");
const topFilterBox = document.querySelector(".filter-box");
const recommendToggleBar = document.getElementById("recommendToggleBar");
const recommendedGearOnly = document.getElementById("recommendedGearOnly");
const recommendedFilterLabel = document.getElementById("recommendedFilterLabel");
const similarFilterLabel = document.getElementById("similarFilterLabel");
const activeFilters = document.getElementById("activeFilters");
const detailBox = document.getElementById("detailBox");
const imageModal = document.getElementById("imageModal");
const modalImage = document.getElementById("modalImage");
const modalCaption = document.getElementById("modalCaption");
const closeImageModal = document.getElementById("closeImageModal");
const zoomOutButton = document.getElementById("zoomOutButton");
const zoomResetButton = document.getElementById("zoomResetButton");
const zoomInButton = document.getElementById("zoomInButton");
const floatScrollUpButton = document.getElementById("floatScrollUpButton");
const floatScrollDownButton = document.getElementById("floatScrollDownButton");
const floatScrollTopButton = document.getElementById("floatScrollTopButton");
const floatScrollCurrentButton = document.getElementById("floatScrollCurrentButton");
const wishlistFloatingButton = document.getElementById("wishlistFloatingButton");
const wishlistFloatingCount = document.getElementById("wishlistFloatingCount");
const appHelpButton = document.getElementById("appHelpButton");
const appNoticeButton = document.getElementById("appNoticeButton");
const appSettingsButton = document.getElementById("appSettingsButton");
const engineTabs = Array.from(document.querySelectorAll(".engine-tab"));
let weaponDataLoaded = false;
let weaponDataPromise = null;
let fullGearDataLoaded = false;
let fullGearDataPromise = null;
let detailLoadVersion = 0;
let detailPreviewVersion = 0;
const TRANSPARENT_PIXEL =
  "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///ywAAAAAAQABAAACAUwAOw==";

installLiveServerReloadGuard();

function installLiveServerReloadGuard() {
  if (!DISABLE_LIVE_SERVER_AUTO_RELOAD || !window.WebSocket) {
    return;
  }

  const isLocalPreview =
    location.hostname === "127.0.0.1" ||
    location.hostname === "localhost" ||
    location.protocol === "file:";

  if (!isLocalPreview || window.__ffxivLiveServerReloadGuardInstalled) {
    return;
  }

  window.__ffxivLiveServerReloadGuardInstalled = true;
  const NativeWebSocket = window.WebSocket;

  function shouldBlockLiveServerMessage(event) {
    const text = String(event?.data || "").toLowerCase();
    return text.includes("reload") || text.includes("refresh");
  }

  window.WebSocket = function(...args) {
    const socket = new NativeWebSocket(...args);
    let wrappedOnMessage = null;

    Object.defineProperty(socket, "onmessage", {
      configurable: true,
      enumerable: true,
      get() {
        return wrappedOnMessage;
      },
      set(handler) {
        wrappedOnMessage = typeof handler === "function"
          ? function(event) {
              if (shouldBlockLiveServerMessage(event)) {
                console.info("已拦截 Live Server 自动刷新。");
                return;
              }

              return handler.call(this, event);
            }
          : handler;
      },
    });

    const nativeAddEventListener = socket.addEventListener.bind(socket);
    socket.addEventListener = function(type, handler, options) {
      if (type !== "message" || typeof handler !== "function") {
        return nativeAddEventListener(type, handler, options);
      }

      return nativeAddEventListener(type, function(event) {
        if (shouldBlockLiveServerMessage(event)) {
          console.info("已拦截 Live Server 自动刷新。");
          return;
        }

        return handler.call(this, event);
      }, options);
    };

    return socket;
  };

  window.WebSocket.prototype = NativeWebSocket.prototype;
  Object.defineProperty(window.WebSocket, "CONNECTING", { value: NativeWebSocket.CONNECTING });
  Object.defineProperty(window.WebSocket, "OPEN", { value: NativeWebSocket.OPEN });
  Object.defineProperty(window.WebSocket, "CLOSING", { value: NativeWebSocket.CLOSING });
  Object.defineProperty(window.WebSocket, "CLOSED", { value: NativeWebSocket.CLOSED });
}

const detailPreviewObserver = new MutationObserver(mutations => {
  detailPreviewVersion += 1;

  mutations.forEach(mutation => {
    mutation.removedNodes.forEach(node => {
      cancelPreviewImageLoads(node);
    });
  });

  queuePreviewImageActivation(detailBox, detailPreviewVersion);
});

function startDetailLoad() {
  cancelAllDetailImageLoads();
  detailLoadVersion += 1;
  return detailLoadVersion;
}

function invalidateDetailLoad() {
  cancelAllDetailImageLoads();
  detailLoadVersion += 1;
}

function isCurrentDetailLoad(version) {
  return version === detailLoadVersion;
}

async function loadGearData() {
  try {
    const [
      gearResponse,
      mirageSetResponse,
      customGearSetResponse,
      gearSeriesResponse,
      gearSetModelLinksResponse
    ] = await Promise.all([
      fetch("generated/gear-pieces-list.json", { cache: "no-store" }),
      fetch("generated/mirage-store-sets.json", { cache: "no-store" }),
      fetch("custom-gear-sets.json", { cache: "no-store" }),
      fetch("gear-series.json", { cache: "no-store" }),
      fetch("gear-set-model-links.json", { cache: "no-store" })
    ]);

    if (!gearResponse.ok) {
      throw new Error(`读取 generated/gear-pieces-list.json 失败：${gearResponse.status}`);
    }

    if (!mirageSetResponse.ok) {
      throw new Error(`读取 generated/mirage-store-sets.json 失败：${mirageSetResponse.status}`);
    }

    if (!customGearSetResponse.ok) {
      throw new Error(`读取 custom-gear-sets.json 失败：${customGearSetResponse.status}`);
    }

    if (!gearSeriesResponse.ok) {
      throw new Error(`读取 gear-series.json 失败：${gearSeriesResponse.status}`);
    }

    if (!gearSetModelLinksResponse.ok) {
      throw new Error(`读取 gear-set-model-links.json 失败：${gearSetModelLinksResponse.status}`);
    }

    const gearListData = await gearResponse.json();
    items = normalizeGearListData(gearListData).map(ensurePreviewImages);
    const visibleGearItemIds = new Set(items.map(item => String(item.id)));
    mirageSets = (await mirageSetResponse.json())
      .map(ensurePreviewImages)
      .filter(setItem => {
        return (setItem.pieces || []).some(piece => visibleGearItemIds.has(String(piece.itemId)));
      });
    const customGearSetData = await customGearSetResponse.json();
    const gearSeriesData = await gearSeriesResponse.json();
    const gearSetModelLinkData = await gearSetModelLinksResponse.json();

    customGearSets = Array.isArray(customGearSetData.sets)
      ? customGearSetData.sets.map(ensurePreviewImages)
      : [];
    gearSeries = Array.isArray(gearSeriesData.series)
      ? gearSeriesData.series.map(ensurePreviewImages)
      : [];
    gearSetModelLinks = Array.isArray(gearSetModelLinkData.links) ? gearSetModelLinkData.links : [];

    buildEntityRegistry();
    if (RUN_BROWSER_DATA_VALIDATION) {
      validateGearData();
    }
    renderWeaponTypeOptions();
    renderList();
  } catch (error) {
    console.error("装备数据加载失败：", error);
    resultList.innerHTML = "<p>装备数据加载失败，请检查 generated/gear-pieces-list.json、generated/mirage-store-sets.json、custom-gear-sets.json、gear-series.json 或 gear-set-model-links.json。</p>";
    resultCount.textContent = "0";
  }
}

function checkRequiredElements() {
  const requiredElements = [
    ["searchInput", searchInput],
    ["equipSlotFilter", equipSlotFilter],
    ["weaponTypeFilter", weaponTypeFilter],
    ["armorOnly", armorOnly],
["accessoryOnly", accessoryOnly],
    ["weaponSlotFilterRow", weaponSlotFilterRow],
    ["mainHandOnly", mainHandOnly],
    ["offHandOnly", offHandOnly],
    ["minItemLevelInput", minItemLevelInput],
    ["maxItemLevelInput", maxItemLevelInput],
    ["minEquipLevelInput", minEquipLevelInput],
    ["maxEquipLevelInput", maxEquipLevelInput],
    ["sourceFilter", sourceFilter],
    ["gearPieceCategoryFilterRow", gearPieceCategoryFilterRow],
    ["gearSetFilters", gearSetFilters],
    ["gearSetSourceCategoryFilter", gearSetSourceCategoryFilter],
    ["gearSetSourceSubcategoryFilter", gearSetSourceSubcategoryFilter],
    ["gearSetSourceDetailFilter", gearSetSourceDetailFilter],
    ["gearSetDresserSetOnly", gearSetDresserSetOnly],
    ["gearSetLooseOnly", gearSetLooseOnly],
    ["gearSetArmoireOnly", gearSetArmoireOnly],
    ["gearSetNotArmoireOnly", gearSetNotArmoireOnly],
    ["gearSetHasModelLinksOnly", gearSetHasModelLinksOnly],
    ["gearSetNoModelLinksOnly", gearSetNoModelLinksOnly],
    ["sortFilter", sortFilter],
    ["marketOnly", marketOnly],
    ["noDyeOnly", noDyeOnly],
    ["marketOnlyFilterLabel", marketOnlyFilterLabel],
    ["dyeOnly", dyeOnly],
    ["dualDyeOnly", dualDyeOnly],
    ["dresserOnly", dresserOnly],
    ["dresserSetOnly", dresserSetOnly],
    ["armoireOnly", armoireOnly],
    ["crestOnly", crestOnly],
    ["pieceGlamourFilterGroup", pieceGlamourFilterGroup],
    ["dresserOnlyFilterLabel", dresserOnlyFilterLabel],
    ["dresserSetOnlyFilterLabel", dresserSetOnlyFilterLabel],
    ["armoireOnlyFilterLabel", armoireOnlyFilterLabel],
    ["crestOnlyFilterLabel", crestOnlyFilterLabel],
    ["dyeScopeNote", dyeScopeNote],
    ["applyFilterButton", applyFilterButton],
    ["resetButton", resetButton],
    ["resultList", resultList],
    ["resultCount", resultCount],
    ["loadMoreButton", loadMoreButton],
    ["recommendToggleBar", recommendToggleBar],
    ["recommendedGearOnly", recommendedGearOnly],
    ["recommendedFilterLabel", recommendedFilterLabel],
    ["similarFilterLabel", similarFilterLabel],
    ["activeFilters", activeFilters],
    ["detailBox", detailBox],
    ["imageModal", imageModal],
    ["modalImage", modalImage],
    ["modalCaption", modalCaption],
    ["closeImageModal", closeImageModal],
    ["zoomOutButton", zoomOutButton],
    ["zoomResetButton", zoomResetButton],
    ["zoomInButton", zoomInButton],
    ["floatScrollUpButton", floatScrollUpButton],
    ["floatScrollDownButton", floatScrollDownButton],
    ["floatScrollTopButton", floatScrollTopButton],
    ["floatScrollCurrentButton", floatScrollCurrentButton],
    ["wishlistFloatingButton", wishlistFloatingButton],
    ["wishlistFloatingCount", wishlistFloatingCount],
    ["engineTabs", engineTabs.length > 0 ? engineTabs : null]
  ];

  const missingElements = requiredElements
    .filter(item => {
      return Array.isArray(item) && item[1] === null;
    })
    .map(item => item[0]);

  const brokenRows = requiredElements
    .filter(item => {
      return !Array.isArray(item);
    });

  if (brokenRows.length > 0) {
    console.error("requiredElements 中有格式错误的项目：", brokenRows);
    return false;
  }

  if (missingElements.length > 0) {
    console.error("页面缺少必要元素：", missingElements);
    return false;
  }

  return true;
}

let selectedItemId = null;
const PAGE_SIZE = 30;
let visibleResultCount = PAGE_SIZE;
let isSameModelExpanded = false;
let isSameModelGalleryExpanded = false;
let skipSelectedScrollOnce = false;
let focusedListWindow = null;
const SAME_MODEL_PREVIEW_COUNT = 5;
const SAME_MODEL_GALLERY_PREVIEW_COUNT = 10;
const FOCUSED_LIST_WINDOW_RADIUS = 15;
const engineStates = {};
const PREVIEW_IMAGE_GROUPS = ["original", "dye1", "dye2", "dyeDouble", "crest"];
const GEAR_SET_SOURCE_CATEGORIES = [
  { value: "all", label: "全部来源" },
  { value: "onlineStore", label: "商城/充值" },
  { value: "instanceContent", label: "副本" },
  { value: "deepPve", label: "深度玩法（PVE）" },
  { value: "pvp", label: "玩家对战（PVP）" },
  { value: "daily", label: "日常" },
  { value: "weekly", label: "周常/休闲" },
  { value: "production", label: "生产玩法" },
  { value: "limitedEvent", label: "限时活动" },
  { value: "comprehensive", label: "深度玩法（综合）" },
  { value: "other", label: "其他" },
  { value: "uncategorized", label: "未分类" }
];

const GEAR_SET_SOURCE_GROUPS = {
  all: [{ value: "all", label: "全部二级来源" }],
  onlineStore: [
    { value: "all", label: "全部商城/充值" },
    { value: "bonusOutfit", label: "特典时装" },
    { value: "npcOutfit", label: "NPC时装" },
    { value: "seasonalOutfit", label: "节日时装" },
    { value: "redeemShop", label: "积分商城" },
    { value: "chocoboGift", label: "陆行鸟礼物站" }
  ],
  instanceContent: [
    { value: "all", label: "全部副本" },
    { value: "dungeon", label: "迷宫挑战（四人本）" },
    { value: "trial", label: "讨伐歼灭战" },
    { value: "allianceRaid", label: "团队任务" },
    { value: "raid", label: "大型任务" },
    { value: "ultimate", label: "绝境战" },
    { value: "chaoticAllianceRaid", label: "诛灭战" }
  ],
  deepPve: [
    { value: "all", label: "全部深度玩法（PVE）" },
    { value: "deepDungeon", label: "深层迷宫" },
    { value: "fieldOperation", label: "特殊场景探索" },
    { value: "variantCriterion", label: "多变迷宫" }
  ],
  pvp: [
    { value: "all", label: "全部玩家对战（PVP）" },
    { value: "theFeast", label: "群狼盛宴" },
    { value: "pvpSeries", label: "星里路标" },
    { value: "pvpCurrency", label: "狼印战绩/战利水晶兑换" }
  ],
  daily: [
    { value: "all", label: "全部日常" },
    { value: "questReward", label: "任务" },
    { value: "tomestone", label: "神典石" },
    { value: "grandCompanySeal", label: "军票" },
    { value: "huntCurrency", label: "狩猎" },
    { value: "bicolorGemstone", label: "临危受命" },
    { value: "retainerTask", label: "雇员探险" },
    { value: "goldSaucer", label: "金碟游乐场" }
  ],
  weekly: [
    { value: "all", label: "全部周常/休闲" },
    { value: "tribalCurrency", label: "友好部族" },
    { value: "customDelivery", label: "老主顾" },
    { value: "weeklyBingo", label: "天书奇谈" },
    { value: "treasureHunt", label: "寻宝" },
    { value: "domanReconstruction", label: "多玛飞地重建" },
    { value: "islandSanctuary", label: "无人岛" }
  ],
  production: [
    { value: "all", label: "全部生产玩法" },
    { value: "combatCraft", label: "普通配方" },
    { value: "masterRecipeCombat", label: "秘籍配方（战斗/生产）装备" },
    { value: "fashionCraft", label: "秘籍配方（时尚装备）" },
    { value: "scripExchange", label: "工票" },
    { value: "desynthesis", label: "道具分解" },
    { value: "ishgardRestoration", label: "重建伊修加德" },
    { value: "cosmicExploration", label: "宇宙探索" }
  ],
  limitedEvent: [
    { value: "all", label: "全部限时活动" },
    { value: "moogleTreasureTrove", label: "旅行莫古力" },
    { value: "seasonal", label: "节日活动" },
    { value: "collaboration", label: "其他活动（联动等）" }
  ],
  comprehensive: [
    { value: "all", label: "全部深度玩法（综合）" },
    { value: "achievementReward", label: "成就" },
    { value: "relicWeapon", label: "特殊装备（肝武）" },
    { value: "hallOfNovice", label: "初学者学堂" }
  ],
  other: [{ value: "all", label: "全部其他" }],
  uncategorized: [{ value: "all", label: "全部未分类" }]
};

const GEAR_SET_SOURCE_DETAILS = {
  all: [{ value: "all", label: "全部三级细分" }],
  trial: [
    { value: "all", label: "全部讨伐歼灭战" },
    { value: "normalTrial", label: "真神" },
    { value: "extremeTrial", label: "极神" },
    { value: "unrealTrial", label: "幻巧战（幻巧拼图）" }
  ],
  raid: [
    { value: "all", label: "全部大型任务" },
    { value: "normalRaid", label: "大型任务（普通）" },
    { value: "savageRaid", label: "大型任务（零式）" }
  ],
  deepDungeon: [
    { value: "all", label: "全部深层迷宫" },
    { value: "palaceOfTheDead", label: "死者宫殿" },
    { value: "heavenOnHigh", label: "天之宫殿" },
    { value: "eurekaOrthos", label: "正统优雷卡" },
    { value: "pilgrimTraverse", label: "朝圣交错路" }
  ],
  fieldOperation: [
    { value: "all", label: "全部特殊场景探索" },
    { value: "eureka", label: "禁地优雷卡" },
    { value: "bozja", label: "天佑女王（博兹雅）" },
    { value: "crescentIsle", label: "新月岛" }
  ],
  questReward: [
    { value: "all", label: "全部任务" },
    { value: "mainScenarioQuest", label: "主线任务" },
    { value: "sideQuest", label: "一般支线任务" },
    { value: "jobQuest", label: "职业/职能任务" }
  ],
  treasureHunt: [
    { value: "all", label: "全部寻宝" },
    { value: "treasureMap", label: "藏宝图" },
    { value: "treasureDungeon", label: "宝物库" }
  ],
  relicWeapon: [
    { value: "all", label: "全部特殊装备（肝武）" },
    { value: "combatRelic", label: "战斗职业肝武" },
    { value: "crafterGathererRelic", label: "生产职业肝武" }
  ]
};

// Detailed acquisition text and source filters are intentionally separate.

function getDefaultFilterState() {
  return {
    keyword: "",
    equipSlot: "all",
    weaponType: "all",
    armorOnly: false,
    accessoryOnly: false,
    mainHandOnly: false,
    offHandOnly: false,
    minItemLevel: "",
    maxItemLevel: "",
    minEquipLevel: "",
    maxEquipLevel: "",
    source: "all",
    gearSetSourceCategory: "all",
    gearSetSourceSubcategory: "all",
    gearSetSourceDetail: "all",
    gearSetDresserSetOnly: false,
    gearSetLooseOnly: false,
    gearSetArmoireOnly: false,
    gearSetNotArmoireOnly: false,
    gearSetHasModelLinksOnly: false,
    gearSetNoModelLinksOnly: false,
    sort: "default",
    marketOnly: false,
    noDyeOnly: false,
    dyeOnly: false,
    dualDyeOnly: false,
    dresserOnly: false,
    dresserSetOnly: false,
    armoireOnly: false,
    crestOnly: false
  };
}

function getFilterStateFromControls() {
  return {
    keyword: searchInput.value,
    equipSlot: equipSlotFilter.value,
    weaponType: weaponTypeFilter.value,
    armorOnly: armorOnly.checked,
    accessoryOnly: accessoryOnly.checked,
    mainHandOnly: mainHandOnly.checked,
    offHandOnly: offHandOnly.checked,
    minItemLevel: minItemLevelInput.value,
    maxItemLevel: maxItemLevelInput.value,
    minEquipLevel: minEquipLevelInput.value,
    maxEquipLevel: maxEquipLevelInput.value,
    source: sourceFilter.value,
    gearSetSourceCategory: gearSetSourceCategoryFilter.value,
    gearSetSourceSubcategory: gearSetSourceSubcategoryFilter.value,
    gearSetSourceDetail: gearSetSourceDetailFilter.value,
    gearSetDresserSetOnly: gearSetDresserSetOnly.checked,
    gearSetLooseOnly: gearSetLooseOnly.checked,
    gearSetArmoireOnly: gearSetArmoireOnly.checked,
    gearSetNotArmoireOnly: gearSetNotArmoireOnly.checked,
    gearSetHasModelLinksOnly: gearSetHasModelLinksOnly.checked,
    gearSetNoModelLinksOnly: gearSetNoModelLinksOnly.checked,
    sort: sortFilter.value,
    marketOnly: marketOnly.checked,
    noDyeOnly: noDyeOnly.checked,
    dyeOnly: dyeOnly.checked,
    dualDyeOnly: dualDyeOnly.checked,
    dresserOnly: dresserOnly.checked,
    dresserSetOnly: dresserSetOnly.checked,
    armoireOnly: armoireOnly.checked,
    crestOnly: crestOnly.checked
  };
}

function applyFilterStateToControls(filterState) {
  const state = {
    ...getDefaultFilterState(),
    ...(filterState || {})
  };

  searchInput.value = state.keyword;
  armorOnly.checked = state.armorOnly;
  accessoryOnly.checked = state.accessoryOnly;
  mainHandOnly.checked = state.mainHandOnly;
  offHandOnly.checked = state.offHandOnly;
  renderEquipSlotOptions();
  equipSlotFilter.value = state.equipSlot;
  renderWeaponTypeOptions();
  weaponTypeFilter.value = getWeaponTypeOptionValues().includes(state.weaponType)
    ? state.weaponType
    : "all";
  minItemLevelInput.value = state.minItemLevel;
  maxItemLevelInput.value = state.maxItemLevel;
  minEquipLevelInput.value = state.minEquipLevel;
  maxEquipLevelInput.value = state.maxEquipLevel;
  sourceFilter.value = state.source;
  gearSetSourceCategoryFilter.value = state.gearSetSourceCategory;
  updateGearSetSubcategoryOptions();
  gearSetSourceSubcategoryFilter.value = state.gearSetSourceSubcategory;
  updateGearSetDetailOptions();
  gearSetSourceDetailFilter.value = state.gearSetSourceDetail;
  gearSetDresserSetOnly.checked = state.gearSetDresserSetOnly;
  gearSetLooseOnly.checked = state.gearSetLooseOnly;
  gearSetArmoireOnly.checked = state.gearSetArmoireOnly;
  gearSetNotArmoireOnly.checked = state.gearSetNotArmoireOnly;
  gearSetHasModelLinksOnly.checked = state.gearSetHasModelLinksOnly;
  gearSetNoModelLinksOnly.checked = state.gearSetNoModelLinksOnly;
  sortFilter.value = state.sort;
  marketOnly.checked = state.marketOnly;
  noDyeOnly.checked = state.noDyeOnly;
  dyeOnly.checked = state.dyeOnly;
  dualDyeOnly.checked = state.dualDyeOnly;
  dresserOnly.checked = state.dresserOnly;
  dresserSetOnly.checked = state.dresserSetOnly;
  armoireOnly.checked = state.armoireOnly;
  crestOnly.checked = state.crestOnly;
}

function getDefaultEngineState() {
  return {
    filterState: getDefaultFilterState(),
    visibleResultCount: PAGE_SIZE,
    selectedItemId: null,
    selectedSetRoute: null,
    selectedSeriesId: null,
    selectedWeaponId: null,
    detailHtml: "请选择词条。",
    isSameModelExpanded: false,
    isSameModelGalleryExpanded: false
  };
}

function saveCurrentEngineState() {
  engineStates[currentEngine] = {
    filterState: getFilterStateFromControls(),
    visibleResultCount,
    selectedItemId,
    selectedSetRoute: selectedSetRoute ? { ...selectedSetRoute } : null,
    selectedSeriesId,
    selectedWeaponId,
    detailHtml: getDetailHtmlForState(),
    isSameModelExpanded,
    isSameModelGalleryExpanded
  };
}

function restoreEngineState(engine) {
  const state = {
    ...getDefaultEngineState(),
    ...(engineStates[engine] || {})
  };

  applyFilterStateToControls(state.filterState);
  visibleResultCount = state.visibleResultCount || PAGE_SIZE;
  selectedItemId = state.selectedItemId ?? null;
  selectedSetRoute = state.selectedSetRoute ? { ...state.selectedSetRoute } : null;
  selectedSeriesId = state.selectedSeriesId ?? null;
  selectedWeaponId = state.selectedWeaponId ?? null;
  isSameModelExpanded = Boolean(state.isSameModelExpanded);
  isSameModelGalleryExpanded = Boolean(state.isSameModelGalleryExpanded);
  detailBox.innerHTML = state.detailHtml || "请选择词条。";
}

function updateCurrentEngineStatePatch(patch) {
  engineStates[currentEngine] = {
    ...getDefaultEngineState(),
    ...(engineStates[currentEngine] || {}),
    ...patch,
    isSameModelExpanded: patch.isSameModelExpanded ?? isSameModelExpanded,
    isSameModelGalleryExpanded: patch.isSameModelGalleryExpanded ?? isSameModelGalleryExpanded
  };
}

function getDetailHtmlForState() {
  if (!CACHE_DETAIL_HTML) {
    return "请选择词条。";
  }

  const clone = detailBox.cloneNode(true);

  clone.querySelectorAll("img[data-preview-src]").forEach(image => {
    image.removeAttribute("src");
    delete image.dataset.previewLoaded;
  });

  return clone.innerHTML || "请选择词条。";
}

function switchEngineTo(targetEngine) {
  if (!targetEngine || targetEngine === currentEngine) {
    return;
  }

  saveCurrentEngineState();
  currentEngine = targetEngine;
  focusedListWindow = null;
  restoreEngineState(currentEngine);
  renderList();
}

function clearFocusedListWindow() {
  focusedListWindow = null;
  renderList();
}

function focusListWindow(engine, id, options = {}) {
  focusedListWindow = {
    engine,
    id: String(id),
    radius: options.radius || FOCUSED_LIST_WINDOW_RADIUS,
    label: options.label || "",
    entityEngine: options.entityEngine || engine,
    entityId: options.entityId === undefined ? id : options.entityId
  };
}

function getFocusedListWindow(itemsForList, engine, getId) {
  if (!focusedListWindow || focusedListWindow.engine !== engine) {
    return null;
  }

  const targetId = String(focusedListWindow.id);
  const targetIndex = itemsForList.findIndex(item => {
    return String(getId(item)) === targetId;
  });

  if (targetIndex < 0) {
    return {
      items: [],
      targetFound: false,
      totalCount: itemsForList.length,
      start: 0,
      end: 0
    };
  }

  const radius = focusedListWindow.radius || FOCUSED_LIST_WINDOW_RADIUS;
  const start = Math.max(0, targetIndex - radius);
  const end = Math.min(itemsForList.length, targetIndex + radius + 1);

  return {
    items: itemsForList.slice(start, end),
    targetFound: true,
    totalCount: itemsForList.length,
    start,
    end
  };
}

function renderFocusedListNotice(focusWindow) {
  if (!focusWindow || !focusedListWindow) {
    return "";
  }

  const label = focusedListWindow.label || "当前词条";
  const rangeText = focusWindow.targetFound
    ? `正在显示 ${label} 附近 ${focusWindow.items.length} 条结果`
    : `${label} 不符合当前筛选，已临时显示目标`;

  return `
    <div class="focused-list-notice">
      <span>${rangeText}</span>
      <button type="button" onclick="clearFocusedListWindow()">返回正常列表</button>
    </div>
  `;
}

function getFocusedFallbackEntity() {
  if (!focusedListWindow) {
    return null;
  }

  const targetEngine = focusedListWindow.entityEngine || focusedListWindow.engine;
  return resolveEntity({
    engine: targetEngine,
    id: focusedListWindow.entityId || focusedListWindow.id
  });
}

function yesNo(value) {
  return value ? "是" : "否";
}

function escapeAttribute(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/"/g, "&quot;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

function getSourceText(item) {
  if (item.sourceSummary) {
    return item.sourceSummary;
  }

  if (item.source) {
    return item.source;
  }

  return "获取方式未记录";
}

function isExpiredSeasonalEventNpcSource(source) {
  if (!source || typeof source !== "object") {
    return false;
  }

  const text = [
    source.sourceProvider,
    source.routeType,
    source.method,
    source.category,
    source.subCategory,
    source.type,
    source.subType,
    source.detail,
    source.npcName,
    source.currency,
    source.note
  ].filter(Boolean).join(" ");
  const isNpcSource = source.category === "npcPurchase" ||
    source.category === "currencyExchange" ||
    source.type === "NPC购买" ||
    source.type === "NPC兑换";

  if (!isNpcSource) {
    return false;
  }

  if (/报酬管理人|失物管理人|古董商|Garland housing Junkmonger/.test(text)) {
    return false;
  }

  return /销售委员|执行委员|星芒节|红莲节|守护天节|降神节|恋人节|女儿节|彩蛋狩猎/.test(text);
}

function getDisplaySources(item) {
  return (item.sources || []).filter(source => !isExpiredSeasonalEventNpcSource(source));
}

function isOnlineStoreSource(source) {
  if (!source || typeof source !== "object") {
    return false;
  }

  if (source.category === "onlineStore") {
    return true;
  }

  if (["sdoOnlineStore", "mogStation", "redeemShop", "chocoboGift"].includes(source.routeType)) {
    return true;
  }

  const text = [
    source.type || "",
    source.subType || "",
    source.detail || ""
  ].join(" ");

  return text.includes("商城") || text.includes("陆行鸟礼物站");
}

function getSourceRenderRank(source) {
  if (source?.routeType === "sdoOnlineStore" || source?.routeType === "mogStation") {
    return 0;
  }

  if (source?.routeType === "chocoboGift") {
    return 1;
  }

  if (source?.routeType === "redeemShop" || source?.subCategory === "redeemShop" || source?.type === "积分商城") {
    return 2;
  }

  if (isOnlineStoreSource(source)) {
    return 3;
  }

  return 10;
}

function renderOnlineStorePriceRow(source) {
  if (!isOnlineStoreSource(source) || !(Number(source.price) > 0)) {
    return "";
  }

  const price = Number(source.price);
  const currency = source.currency || "点券";
  const rmb = currency === "点券"
    ? `（${(price / 100).toFixed(0)}元）`
    : "";
  const label = source.routeType === "redeemShop" || source.subCategory === "redeemShop" || source.type === "积分商城"
    ? "兑换价格"
    : (source.subCategory === "storePiece" ? "单品价格" : "套装价格");

  return `<div class="source-row">${label}：${price}${currency}${rmb}</div>`;
}

function getBestBattleContentNameForItem(item) {
  const sources = Array.isArray(item.sources) ? item.sources.filter(isBattleContentSource) : [];
  let bestName = "";
  let bestScore = Number.NEGATIVE_INFINITY;

  sources.forEach(source => {
    const lowTokenKey = getLowTokenKey(source);
    const name = isLowTokenExchangeSource(source)
      ? getExchangeContentName(source, lowTokenKey)
      : getBattleContentName(source);
    const score = isLowTokenExchangeSource(source)
      ? getSourceContentConfidence(source, lowTokenKey)
      : (resolveBattleContentAlias(name) ? 100 : 0) + (/歼殛战|歼灭战|讨灭战|讨伐战|零式|绝境战|异闻/.test(name) ? 50 : 0);

    if (name && score > bestScore) {
      bestName = name;
      bestScore = score;
    }
  });

  return bestName;
}

function getDetailSources(item) {
  const sources = getDisplaySources(item);
  const inferredCoffers = getInferredBattleCofferSources(item, getBestBattleContentNameForItem(item));
  const seen = new Set();

  return [...sources, ...inferredCoffers].filter(source => {
    const key = [
      source.type || "",
      source.subType || "",
      source.detail || "",
      source.contentName || "",
      source.currency || "",
      source.price || "",
      source.containerItem?.id || "",
      source.containerItem?.name || ""
    ].join("|");

    if (seen.has(key)) {
      return false;
    }
    seen.add(key);
    return true;
  });
}

function refreshDetailAfterBattleCofferIndexLoads(engine, itemId) {
  if (battleCofferIndex) {
    return;
  }

  loadBattleCofferIndex().then(() => {
    if (engine === "weaponPieces" && selectedWeaponId === itemId) {
      const weapon = getEntityData({ engine, id: itemId });
      if (weapon) {
        showWeaponDetail(weapon);
      }
    }

    if (engine === "gearPieces" && selectedItemId === itemId) {
      const item = getEntityData({ engine, id: itemId });
      if (item) {
        showDetail(item);
      }
    }
  });
}

function refreshDetailAfterRecipeCraftIndexLoads(engine, itemId) {
  if (recipeCraftIndex) {
    return;
  }

  loadRecipeCraftIndex().then(() => {
    if (engine === "weaponPieces" && selectedWeaponId === itemId) {
      const weapon = getEntityData({ engine, id: itemId });
      if (weapon) {
        showWeaponDetail(weapon);
      }
    }

    if (engine === "gearPieces" && selectedItemId === itemId) {
      const item = getEntityData({ engine, id: itemId });
      if (item) {
        showDetail(item);
      }
    }
  });
}

function refreshDetailAfterNpcLocationIndexLoads(engine, itemId) {
  if (npcLocationIndex) {
    return;
  }

  loadNpcLocationIndex().then(() => {
    if (engine === "weaponPieces" && selectedWeaponId === itemId) {
      const weapon = getEntityData({ engine, id: itemId });
      if (weapon) {
        showWeaponDetail(weapon);
      }
    }

    if (engine === "gearPieces" && selectedItemId === itemId) {
      const item = getEntityData({ engine, id: itemId });
      if (item) {
        showDetail(item);
      }
    }
  });
}

function getCraftSourceRecipeId(source) {
  if (source.recipeId) {
    return String(source.recipeId);
  }

  const detailMatch = String(source.detail || "").match(/Recipe\s+(\d+)/i);
  if (detailMatch) {
    return detailMatch[1];
  }

  const noteMatch = String(source.note || "").match(/recipe(?:Id)?=(\d+)/i);
  return noteMatch ? noteMatch[1] : "";
}

function getCraftRecipeInfo(source) {
  const recipeId = getCraftSourceRecipeId(source);
  const indexed = recipeId && recipeCraftIndex && recipeCraftIndex.recipes
    ? recipeCraftIndex.recipes[recipeId]
    : null;

  return {
    recipeId,
    crafterJob: source.crafterJob || (indexed && indexed.crafterJob) || "",
    craftLevel: source.craftLevel || (indexed && indexed.craftLevel) || "",
    recipeBook: source.recipeBook || (indexed && indexed.recipeBook) || "",
    stars: source.stars || (indexed && indexed.stars) || 0
  };
}

function getCraftRecipeSubtype(source, craftInfo) {
  const recipeBook = String(craftInfo && craftInfo.recipeBook || "").trim();
  if (recipeBook) {
    return recipeBook;
  }

  const subType = String(source && source.subType || "").trim();
  if (!subType || subType === "普通配方/秘籍配方" || subType === "普通制作") {
    return "普通配方";
  }

  if (subType === "秘籍制作" || subType === "秘籍配方") {
    return recipeBook || "秘籍配方";
  }

  return subType;
}

function shouldRenderSourceDetail(source) {
  const detail = String(source.detail || "").trim();
  if (!detail) {
    return false;
  }

  if (source.type === "制作") {
    return !(/^Recipe\s+\d+$/i.test(detail) || /制作(?:获得)?$/.test(detail));
  }

  return true;
}

function getNpcLocationInfo(source) {
  const npcId = source && source.npcId ? String(source.npcId) : "";
  if (!npcId || !npcLocationIndex || !npcLocationIndex.npcs) {
    return null;
  }

  return npcLocationIndex.npcs[npcId] || null;
}

function formatNpcLocation(location) {
  if (!location) {
    return "";
  }

  const placeName = location.placeName || "未知地图";
  const hasCoords = location.x !== null && location.x !== undefined && location.y !== null && location.y !== undefined;
  return hasCoords
    ? `${placeName}（X:${location.x} Y:${location.y}）`
    : placeName;
}

function renderNpcLocationRows(source) {
  const indexed = getNpcLocationInfo(source);
  const locations = indexed && Array.isArray(indexed.locations) ? indexed.locations : [];
  const formattedLocations = locations
    .map(formatNpcLocation)
    .filter(Boolean);

  if (formattedLocations.length > 0) {
    const shown = formattedLocations.slice(0, 3);
    const suffix = formattedLocations.length > shown.length ? ` 等 ${formattedLocations.length} 处` : "";
    return `<div class="source-row">位置：${shown.join("；")}${suffix}</div>`;
  }

  return source.location
    ? `<div class="source-row">位置：${source.location}</div>`
    : "";
}

function renderSources(item) {
  const detailSources = getDetailSources(item);

  if (detailSources.length === 0) {
    return `
      <details class="source-box" open>
        <summary class="source-title">获取方式</summary>
        <div class="source-simple">${getSourceText(item)}</div>
      </details>
    `;
  }

  const sortedSources = detailSources
    .map((source, index) => ({ source, index }))
    .sort((a, b) => getSourceRenderRank(a.source) - getSourceRenderRank(b.source) || a.index - b.index)
    .map(entry => entry.source);

  const sourceItems = sortedSources.map(source => {
    let extraRows = "";
    let sourceSubType = source.subType || "";

    if (source.type === "制作") {
      const craftInfo = getCraftRecipeInfo(source);
      sourceSubType = getCraftRecipeSubtype(source, craftInfo);

      extraRows += craftInfo.crafterJob
        ? `<div class="source-row">生产职业：${craftInfo.crafterJob}</div>`
        : "";

      extraRows += craftInfo.craftLevel
        ? `<div class="source-row">制作等级：${craftInfo.craftLevel}级</div>`
        : "";
    }

    if (source.type === "NPC购买" || source.type === "NPC兑换") {
      extraRows += source.npcName
        ? `<div class="source-row">NPC：${source.npcName}</div>`
        : "";

      extraRows += renderNpcLocationRows(source);

      if (source.price !== null && source.price !== undefined && source.currency) {
        extraRows += `<div class="source-row">价格：${source.price} ${source.currency}</div>`;
      }

      if (source.currencySource) {
        extraRows += `
          <div class="source-row">
            货币来源：${source.currencySource.type || ""}
            ${source.currencySource.detail ? ` / ${source.currencySource.detail}` : ""}
          </div>
        `;
      }
    }

    extraRows += renderOnlineStorePriceRow(source);

    if (
      source.type === "副本掉落" ||
      source.type === "副本宝箱" ||
      source.type === "讨伐歼灭战" ||
      source.type === "团队任务" ||
      source.type === "大型任务"
    ) {
      extraRows += source.contentName
        ? `<div class="source-row">内容名称：${source.contentName}</div>`
        : "";

      extraRows += source.contentLevel
        ? `<div class="source-row">内容等级：${source.contentLevel}</div>`
        : "";
    }

    if (source.containerItem && source.containerItem.name) {
      extraRows += `<div class="source-row">装备箱：${source.containerItem.name}</div>`;
    }

    return `
      <div class="source-item">
        <div class="source-type">${source.type || "获取方式"}</div>

        ${sourceSubType ? `<div class="source-row">细分：${sourceSubType}</div>` : ""}
        ${shouldRenderSourceDetail(source) ? `<div class="source-row">详情：${source.detail}</div>` : ""}

        ${extraRows}
      </div>
    `;
  }).join("");

  return `
    <details class="source-box" open>
      <summary class="source-title">获取方式</summary>
      ${sourceItems}
    </details>
  `;
}

function getSourceTypes(item) {
  const displaySources = getDisplaySources(item);
  if (displaySources.length > 0) {
    return displaySources.map(source => source.type);
  }

  if (item.sourceSummary) {
    return item.sourceSummary.split("/").map(text => text.trim());
  }

  if (item.source) {
    return item.source.split("/").map(text => text.trim());
  }

  return [];
}

function hasSourceType(item, sourceType) {
  const sourceTypes = getSourceTypes(item);

  return sourceTypes.some(type => type.includes(sourceType));
}

const ALL_EQUIP_SLOT_OPTIONS = [
  { value: "all", label: "全部装备栏部位" },
  { value: "头部", label: "头部" },
  { value: "身体", label: "身体" },
  { value: "手部", label: "手部" },
  { value: "腿部", label: "腿部" },
  { value: "脚部", label: "脚部" },
  { value: "耳饰", label: "耳饰" },
  { value: "项链", label: "项链" },
  { value: "手镯", label: "手镯" },
  { value: "戒指", label: "戒指" }
];

const ARMOR_EQUIP_SLOT_OPTIONS = [
  { value: "all", label: "全部防具栏位" },
  { value: "头部", label: "头部" },
  { value: "身体", label: "身体" },
  { value: "手部", label: "手部" },
  { value: "腿部", label: "腿部" },
  { value: "脚部", label: "脚部" }
];

const ACCESSORY_EQUIP_SLOT_OPTIONS = [
  { value: "all", label: "全部饰品栏位" },
  { value: "耳饰", label: "耳饰" },
  { value: "项链", label: "项链" },
  { value: "手镯", label: "手镯" },
  { value: "戒指", label: "戒指" }
];

const GEAR_SET_CATEGORY_OPTIONS = [
  { value: "all", label: "全部套装类别" },
  { value: "combatArmor", label: "战斗职业套装" },
  { value: "craftGatherArmor", label: "生产职业套装" },
  { value: "combatAccessory", label: "战斗职业饰品套装" },
  { value: "craftGatherAccessory", label: "生产职业饰品套装" },
  { value: "other", label: "其他套装" }
];

const GEAR_SERIES_CATEGORY_OPTIONS = [
  { value: "all", label: "全部系列类别" },
  { value: "combatArmor", label: "战斗职业系列" },
  { value: "craftGatherArmor", label: "生产职业系列" },
  { value: "combatAccessory", label: "战斗职业饰品系列" },
  { value: "craftGatherAccessory", label: "生产职业饰品系列" },
  { value: "other", label: "其他系列" }
];

const ACCESSORY_SLOTS = ["耳饰", "项链", "手镯", "戒指"];

const CRAFT_GATHER_SET_KEYWORDS = [
  "巧匠",
  "大地",
  "能工巧匠",
  "大地使者",
  "刻木匠",
  "锻铁匠",
  "铸甲匠",
  "雕金匠",
  "制革匠",
  "裁衣匠",
  "炼金术士",
  "烹调师",
  "采矿工",
  "园艺工",
  "捕鱼人"
];

const COMBAT_SET_KEYWORDS = [
  "御敌",
  "制敌",
  "强袭",
  "精准",
  "游击",
  "治愈",
  "咏咒",
  "强攻",
  "骑士",
  "战士",
  "暗黑骑士",
  "绝枪战士",
  "武僧",
  "龙骑士",
  "忍者",
  "武士",
  "钐镰客",
  "蝰蛇剑士",
  "吟游诗人",
  "机工士",
  "舞者",
  "黑魔法师",
  "召唤师",
  "赤魔法师",
  "绘灵法师",
  "白魔法师",
  "学者",
  "占星术士",
  "贤者"
];

const WEAPON_TYPE_ORDER = [
  "单手剑",
  "盾",
  "大斧",
  "双手剑",
  "枪刃",
  "长枪",
  "双手镰刀",
  "格斗武器",
  "武士刀",
  "双剑",
  "蝰蛇对剑",
  "弓",
  "火枪",
  "投掷武器",
  "单手咒杖",
  "双手咒杖",
  "魔导书",
  "刺剑",
  "画笔",
  "单手幻杖",
  "双手幻杖",
  "魔导书（学者专用）",
  "天球仪",
  "贤具",
  "青魔杖"
];

function getCurrentEquipSlotOptions() {
  if (currentEngine === "gearSets") {
    return GEAR_SET_CATEGORY_OPTIONS;
  }

  if (currentEngine === "gearSeries") {
    return GEAR_SERIES_CATEGORY_OPTIONS;
  }

  if (armorOnly.checked) {
    return ARMOR_EQUIP_SLOT_OPTIONS;
  }

  if (accessoryOnly.checked) {
    return ACCESSORY_EQUIP_SLOT_OPTIONS;
  }

  return ALL_EQUIP_SLOT_OPTIONS;
}

function renderEquipSlotOptions() {
  const currentValue = equipSlotFilter.value;
  const options = getCurrentEquipSlotOptions();
  const validValues = options.map(option => option.value);

  equipSlotFilter.innerHTML = options
    .map(option => {
      return `<option value="${option.value}">${option.label}</option>`;
    })
    .join("");

  if (validValues.includes(currentValue)) {
    equipSlotFilter.value = currentValue;
  } else {
    equipSlotFilter.value = "all";
  }
}

async function loadWeaponData() {
  if (weaponDataLoaded) {
    return;
  }

  if (weaponDataPromise) {
    return weaponDataPromise;
  }

  weaponDataPromise = (async () => {
    const [weaponResponse, weaponSeriesResponse] = await Promise.all([
      fetch("weapon-data.json"),
      fetch("weapon-series.json")
    ]);

    if (!weaponResponse.ok) {
      throw new Error(`读取 weapon-data.json 失败：${weaponResponse.status}`);
    }

    if (!weaponSeriesResponse.ok) {
      throw new Error(`读取 weapon-series.json 失败：${weaponSeriesResponse.status}`);
    }

    const weaponData = await weaponResponse.json();
    const weaponSeriesData = await weaponSeriesResponse.json();

    weaponItems = Array.isArray(weaponData)
      ? weaponData.filter(weapon => !weapon.isBanned)
      : [];
    weaponSeries = Array.isArray(weaponSeriesData.series) ? weaponSeriesData.series : [];
    weaponDataLoaded = true;
    weaponDataPromise = null;

    buildEntityRegistry();
    renderWeaponTypeOptions();
  })();

  try {
    await weaponDataPromise;
  } catch (error) {
    weaponDataPromise = null;
    throw error;
  }
}

function normalizeGearListData(data) {
  if (Array.isArray(data)) {
    return data;
  }

  if (!data || !Array.isArray(data.schema) || !Array.isArray(data.rows)) {
    return [];
  }

  return data.rows.map(row => {
    const item = {};

    data.schema.forEach((field, index) => {
      item[field] = row[index];
    });

    return item;
  });
}

async function loadFullGearData() {
  if (fullGearDataLoaded) {
    return;
  }

  if (fullGearDataPromise) {
    return fullGearDataPromise;
  }

  fullGearDataPromise = (async () => {
    const response = await fetch("gear-data.json", { cache: "no-store" });

    if (!response.ok) {
      throw new Error(`读取 gear-data.json 失败：${response.status}`);
    }

    const fullText = await response.text();
    const fullItems = JSON.parse(fullText.replace(/^\uFEFF/, ""));
    items = Array.isArray(fullItems)
      ? fullItems.filter(item => !item.isBanned).map(ensurePreviewImages)
      : [];
    fullGearDataLoaded = true;
    fullGearDataPromise = null;
    buildEntityRegistry();
  })();

  try {
    await fullGearDataPromise;
  } catch (error) {
    fullGearDataPromise = null;
    throw error;
  }
}

function renderDetailLoading(message = "正在加载详情数据。") {
  detailBox.innerHTML = `
    <div class="empty-result">
      <p>${message}</p>
      <p class="empty-result-tip">完整详情数据会在第一次打开详情页时读取，之后会保留在页面内存里。</p>
    </div>
  `;
}

function renderDetailLoadError(error) {
  console.error("完整装备数据加载失败：", error);
  const errorMessage = error && error.message ? error.message : String(error || "未知错误");
  detailBox.innerHTML = `
    <div class="empty-result">
      <p>详情数据加载失败。</p>
      <p class="empty-result-tip">请检查 gear-data.json 是否存在且格式正确。</p>
      <p class="empty-result-tip">具体错误：${errorMessage}</p>
    </div>
  `;
}

function getWeaponTypeOptions() {
  const weaponTypes = Array.from(new Set(
    weaponItems
      .map(weapon => weapon.weaponType || "")
      .filter(Boolean)
  )).sort((a, b) => {
    const indexA = WEAPON_TYPE_ORDER.indexOf(a);
    const indexB = WEAPON_TYPE_ORDER.indexOf(b);

    if (indexA >= 0 && indexB >= 0) {
      return indexA - indexB;
    }

    if (indexA >= 0) {
      return -1;
    }

    if (indexB >= 0) {
      return 1;
    }

    return String(a).localeCompare(String(b), "zh-Hans-CN");
  });

  return [
    { value: "all", label: "全部武器类型" },
    ...weaponTypes.map(type => ({ value: type, label: type }))
  ];
}

function getWeaponTypeOptionValues() {
  return getWeaponTypeOptions().map(option => option.value);
}

function renderWeaponTypeOptions() {
  const currentValue = weaponTypeFilter.value;
  const options = getWeaponTypeOptions();
  const validValues = options.map(option => option.value);

  weaponTypeFilter.innerHTML = options
    .map(option => {
      return `<option value="${option.value}">${option.label}</option>`;
    })
    .join("");

  weaponTypeFilter.value = validValues.includes(currentValue)
    ? currentValue
    : "all";
}

function getDyeLevel(item) {
  if (item.canDualDye) {
    return 2;
  }

  if (item.canDye) {
    return 1;
  }

  return 0;
}

function renderDyeDots(item) {
  const dyeLevel = getDyeLevel(item);

  if (dyeLevel === 0) {
    return `<span class="status-tag tag-muted">不可染</span>`;
  }

  if (dyeLevel === 1) {
    return `
      <span class="status-tag tag-dye">
        <span class="dye-dot"></span>
        单染
      </span>
    `;
  }

  return `
    <span class="status-tag tag-dual-dye">
      <span class="dye-dot"></span>
      <span class="dye-dot"></span>
      双染
    </span>
  `;
}

function renderDresserTag(item) {
  if (!item.canDresser) {
    return `<span class="status-tag tag-muted">不可加入投影台</span>`;
  }

  if (item.canDresserSet) {
    return `
      <span class="status-tag tag-dresser-set">
        <span class="corner-icon">＋</span>
        可成套加入投影台
      </span>
    `;
  }

  return `
    <span class="status-tag tag-dresser">
      <span class="corner-icon">◇</span>
      单独加入投影台
    </span>
  `;
}

function renderArmoireTag(item) {
  if (item.canArmoire) {
    return `<span class="status-tag tag-armoire">收藏柜</span>`;
  }

  return `<span class="status-tag tag-muted">非收藏柜</span>`;
}

function renderCrestTag(item) {
  if (item.canCrest) {
    return `<span class="status-tag tag-crest">部队徽记</span>`;
  }

  return `<span class="status-tag tag-muted">无部队徽记</span>`;
}

function renderDresserSetTag(canDresserSet) {
  if (canDresserSet) {
    return `
      <span class="status-tag tag-dresser-set">
        <span class="corner-icon">＋</span>
        可成套加入投影台
      </span>
    `;
  }

  return `<span class="status-tag tag-muted">尚未收录成套</span>`;
}

function renderAggregateArmoireTag(canArmoire) {
  return canArmoire
    ? `<span class="status-tag tag-armoire">收藏柜</span>`
    : `<span class="status-tag tag-muted">非收藏柜</span>`;
}

function renderTradeTags(item) {
  const marketText = item.canSellOnMarket ? "可在市场出售" : "不可在市场出售";
  const marketClass = item.canSellOnMarket ? "trade-market-yes" : "trade-market-no";

  const uniqueText = item.isUnique ? "只能持有一个" : "可重复持有";
  const uniqueClass = item.isUnique ? "trade-unique" : "trade-repeatable";

  return `
    <div class="trade-line">
      <span class="trade-tag ${marketClass}">${marketText}</span>
      <span class="trade-tag ${uniqueClass}">${uniqueText}</span>
    </div>
  `;
}

function renderVisualSlots(item) {
  return item.visualSlots.join(" / ");
}

function renderWeaponJobs(weapon) {
  if (Array.isArray(weapon.jobs) && weapon.jobs.length > 0) {
    return weapon.jobs.join(" / ");
  }

  return weapon.weaponType || "未记录";
}

function renderWeaponCategory(weapon) {
  const weaponType = weapon.weaponType || "未记录";
  const weaponSlot = weapon.weaponSlot || "";

  if (!weaponSlot) {
    return weaponType;
  }

  return `${weaponType}（${weaponSlot}）`;
}

function renderWeaponStructureSummary(weapon) {
  return `对应职业：${renderWeaponJobs(weapon)} / 武器类别：${renderWeaponCategory(weapon)}`;
}

function getSetIds(item) {
  if (Array.isArray(item.setIds)) {
    return item.setIds;
  }

  if (item.setId) {
    return [item.setId];
  }

  return [];
}

function getCustomSetIds(item) {
  return Array.isArray(item.customSetIds) ? item.customSetIds : [];
}

function getSetNameById(setId) {
  const set = getEntityData({
    engine: "gearSets",
    id: setId
  });

  if (!set) {
    return `套装 ${setId}`;
  }

  return set.setName || `套装 ${setId}`;
}

function getCustomSetNameById(customSetId) {
  const set = getEntityData({
    engine: "customGearSets",
    id: customSetId
  });

  return set ? set.name || `自定义套装 ${customSetId}` : `自定义套装 ${customSetId}`;
}

function getItemsInSet(setId) {
  return gearItemsBySetId[String(setId)] || [];
}

function getItemsInCustomSet(customSetId) {
  return gearItemsByCustomSetId[String(customSetId)] || [];
}

function getEquipSlotOrder(equipSlot) {
  const order = {
    "头部": 1,
    "身体": 2,
    "手部": 3,
    "腿部": 4,
    "脚部": 5,
    "耳饰": 6,
    "项链": 7,
    "手镯": 8,
    "戒指": 9
  };

  return order[equipSlot] || 999;
}

function sortSetItemsBySlot(setItems) {
  return [...setItems].sort((a, b) => {
    const slotDiff = getEquipSlotOrder(a.equipSlot) - getEquipSlotOrder(b.equipSlot);

    if (slotDiff !== 0) {
      return slotDiff;
    }

    return String(a.name).localeCompare(String(b.name), "zh-Hans-CN");
  });
}

function renderSameSetItems(item) {
  const setIds = getSetIds(item);
  const customSetIds = getCustomSetIds(item);

  if (setIds.length === 0 && customSetIds.length === 0) {
    return "";
  }

  const officialCardsHtml = setIds.map(setId => {
    const setName = getSetNameById(setId);
    const setItems = sortSetItemsBySlot(getItemsInSet(setId));

    if (setItems.length === 0) {
      return "";
    }

    const itemListHtml = setItems.map(other => {
      const isCurrent = String(other.id) === String(item.id);

      if (isCurrent) {
        return `
          <li>
            <span class="same-set-current">
              ${other.name}
            </span>
            <span class="same-set-meta"> / ${other.equipSlot} / 品级 ${other.itemLevel} / 当前查看</span>
          </li>
        `;
      }

      return `
        <li>
          <button class="table-link" data-navigate-engine="gearPieces" data-navigate-id="${escapeAttribute(other.id)}">
            ${other.name}
          </button>
          <span class="same-set-meta"> / ${other.equipSlot} / 品级 ${other.itemLevel}</span>
        </li>
      `;
    }).join("");

    return `
      <div class="same-set-card">
        <h5>
          <button class="gallery-link" data-navigate-engine="gearSets" data-navigate-id="${escapeAttribute(setId)}">
            ${setName}
          </button>
          —— 共 ${setItems.length} 件
        </h5>
        <ul class="same-set-list">
          ${itemListHtml}
        </ul>
      </div>
    `;
  }).join("");
  const customCardsHtml = customSetIds.map(customSetId => {
    const setName = getCustomSetNameById(customSetId);
    const setItems = sortSetItemsBySlot(getItemsInCustomSet(customSetId));

    if (setItems.length === 0) {
      return "";
    }

    const itemListHtml = setItems.map(other => {
      const isCurrent = String(other.id) === String(item.id);

      if (isCurrent) {
        return `
          <li>
            <span class="same-set-current">
              ${other.name}
            </span>
            <span class="same-set-meta"> / ${other.equipSlot} / 品级 ${other.itemLevel} / 当前查看</span>
          </li>
        `;
      }

      return `
        <li>
          <button class="table-link" data-navigate-engine="gearPieces" data-navigate-id="${escapeAttribute(other.id)}">
            ${other.name}
          </button>
          <span class="same-set-meta"> / ${other.equipSlot} / 品级 ${other.itemLevel}</span>
        </li>
      `;
    }).join("");

    return `
      <div class="same-set-card">
        <h5>
          <button class="gallery-link" data-navigate-engine="customGearSets" data-navigate-id="${escapeAttribute(customSetId)}">
            ${setName}
          </button>
          <span class="same-set-meta"> —— 人为收录，暂未有官方套装</span>
        </h5>
        <ul class="same-set-list">
          ${itemListHtml}
        </ul>
      </div>
    `;
  }).join("");
  const cardsHtml = officialCardsHtml + customCardsHtml;

  if (!cardsHtml.trim()) {
    return "";
  }

  return `
    <div class="same-set-box">
      <h4>同套装散件</h4>
      <div class="same-set-card-row">
        ${cardsHtml}
      </div>
    </div>
  `;
}

function normalizePreviewEntry(entry) {
  if (!entry) {
    return {
      common: "",
      male: "",
      female: ""
    };
  }

  if (typeof entry === "string") {
    return {
      common: entry,
      male: "",
      female: ""
    };
  }

  return {
    common: entry.common || "",
    male: entry.male || "",
    female: entry.female || ""
  };
}

function createEmptyPreviewImages() {
  return PREVIEW_IMAGE_GROUPS.reduce((result, group) => {
    result[group] = normalizePreviewEntry("");
    return result;
  }, {});
}

function normalizePreviewImages(previewImages) {
  const normalized = createEmptyPreviewImages();

  if (!previewImages || typeof previewImages !== "object") {
    return normalized;
  }

  PREVIEW_IMAGE_GROUPS.forEach(group => {
    normalized[group] = normalizePreviewEntry(previewImages[group]);
  });

  return normalized;
}

function ensurePreviewImages(item) {
  if (!item || typeof item !== "object") {
    return item;
  }

  return {
    ...item,
    previewImages: normalizePreviewImages(item.previewImages)
  };
}

function getPreviewImages(item) {
  if (item && item.previewImages) {
    return normalizePreviewImages(item.previewImages);
  }

  const fallbackImages = {
    original: normalizePreviewEntry(item?.compareImage || ""),
    dye1: normalizePreviewEntry(""),
    dye2: normalizePreviewEntry(""),
    dyeDouble: normalizePreviewEntry(""),
    crest: normalizePreviewEntry("")
  };

  if (item?.variants && item.variants.length > 0) {
    fallbackImages.original = normalizePreviewEntry(item.variants[0]?.image || item.compareImage || "");
    fallbackImages.dye1 = normalizePreviewEntry(item.variants[1]?.image || "");
    fallbackImages.dye2 = normalizePreviewEntry(item.variants[2]?.image || "");
    fallbackImages.dyeDouble = normalizePreviewEntry(item.variants[3]?.image || "");
  }

  return fallbackImages;
}

function getPreviewThumbnailSrc(imageSrc) {
  if (!imageSrc) {
    return "";
  }

  return imageSrc.replace(
    /^(images\/(?:pieces|weapons|sets|series)\/)([^/]+\/)/,
    "$1thumbs/$2"
  );
}

function handlePreviewThumbError(image) {
  image.removeAttribute("src");
  image.classList.add("preview-thumb-missing");
  image.alt = image.alt ? `${image.alt}（缩略图未注入）` : "缩略图未注入";
}

function renderPreviewBlock(previewEntry, altText, contextText = "") {
  previewEntry = applyPreviewGenderPreference(previewEntry);
  const hasCommon = previewEntry.common !== "";
  const captionBase = contextText ? `${contextText}｜${altText}` : altText;
  const hasMale = previewEntry.male !== "";
  const hasFemale = previewEntry.female !== "";

  if (hasCommon) {
    return `
      <img
        data-preview-src="${getPreviewThumbnailSrc(previewEntry.common)}"
        data-full-src="${previewEntry.common}"
        alt="${captionBase}"
        loading="lazy"
        decoding="async"
        fetchpriority="low"
        onerror="handlePreviewThumbError(this)"
        onclick='event.stopPropagation(); openImageModal(${JSON.stringify(previewEntry.common)}, ${JSON.stringify(captionBase)})'
      >
    `;
  }

  if (!hasMale && !hasFemale) {
    return "";
  }

  const genderLayoutClass = hasMale && hasFemale ? "preview-dual" : "preview-dual preview-dual-single";

  return `
    <div class="${genderLayoutClass}">
      ${
        hasMale
          ? `
            <div class="preview-gender-block">
              <img
                data-preview-src="${getPreviewThumbnailSrc(previewEntry.male)}"
                data-full-src="${previewEntry.male}"
                alt="${captionBase} 男"
                loading="lazy"
                decoding="async"
                fetchpriority="low"
                onerror="handlePreviewThumbError(this)"
                onclick='event.stopPropagation(); openImageModal(${JSON.stringify(previewEntry.male)}, ${JSON.stringify(captionBase + "｜男")})'
              >
              <div class="preview-gender-label">男</div>
            </div>
          `
          : ""
      }

      ${
        hasFemale
          ? `
            <div class="preview-gender-block">
              <img
                data-preview-src="${getPreviewThumbnailSrc(previewEntry.female)}"
                data-full-src="${previewEntry.female}"
                alt="${captionBase} 女"
                loading="lazy"
                decoding="async"
                fetchpriority="low"
                onerror="handlePreviewThumbError(this)"
                onclick='event.stopPropagation(); openImageModal(${JSON.stringify(previewEntry.female)}, ${JSON.stringify(captionBase + "｜女")})'
              >
              <div class="preview-gender-label">女</div>
            </div>
          `
          : ""
      }
    </div>
  `;
}

function hasGenderSplitImage(previewEntry) {
  previewEntry = applyPreviewGenderPreference(previewEntry);
  const hasCommon = previewEntry.common !== "";
  const hasMale = previewEntry.male !== "";
  const hasFemale = previewEntry.female !== "";

  return !hasCommon && hasMale && hasFemale;
}

function hasAnyPreviewImage(previewEntry) {
  return (
    previewEntry.common !== "" ||
    previewEntry.male !== "" ||
    previewEntry.female !== ""
  );
}

function renderSetPieces(item) {
  if (!item.setPieces || item.setPieces.length === 0) {
    return "暂无套装部件信息";
  }

  return item.setPieces.join(" / ");
}

function renderStructureSummary(item) {
  if (item.type === "套装") {
    return `共 ${item.setPieces.length} 件：${renderSetPieces(item)}`;
  }

  return `装备栏：${item.equipSlot} / 视觉覆盖：${renderVisualSlots(item)}`;
}

function renderInfoCard(item) {
  return `
    <div class="gear-info-card">
      <img class="gear-info-icon" src="${item.icon}" alt="${item.name}">
      ${renderWishlistButton("gearPieces", item.id)}

      <div class="gear-info-main">
        <div class="gear-info-name">${item.name}</div>
        <div class="gear-info-subtitle">${item.type} / ${item.equipSlot}</div>

        <div class="gear-info-grid">
          <div>
            <span class="info-label">品级</span>
            <span class="info-value">${item.itemLevel}</span>
          </div>
          <div>
            <span class="info-label">装备等级</span>
            <span class="info-value">${item.equipLevel}</span>
          </div>
          ${
  item.type === "套装"
    ? `
      <div>
        <span class="info-label">包含部件</span>
        <span class="info-value">${renderSetPieces(item)}</span>
      </div>
      <div>
        <span class="info-label">装备栏部位</span>
        <span class="info-value">${item.equipSlot}</span>
      </div>
    `
    : `
      <div>
        <span class="info-label">装备栏部位</span>
        <span class="info-value">${item.equipSlot}</span>
      </div>
      <div>
        <span class="info-label">视觉覆盖</span>
        <span class="info-value">${renderVisualSlots(item)}</span>
      </div>
    `
}
        </div>
      </div>
    </div>
  `;
}

function renderWishlistButton(engine, id, mode) {
  mode = mode || "default";
  var state = getWishlistTargetState(engine, id, mode);
  var isComplete = state === "complete";
  var isPartial = state === "partial";
  var actionLabel = "加入愿望单";

  if (mode === "armorOnly") {
    actionLabel = "仅添加防具";
  } else if (mode === "allPieces") {
    actionLabel = "添加全部";
  }

  var label;

  if (isComplete) {
    label = actionLabel + "：已加入，点击移除";
  } else if (isPartial) {
    label = actionLabel + "：部分已加入，点击补全";
  } else {
    label = actionLabel;
  }

  var cls = "wishlist-toggle-button wishlist-icon-button wishlist-mode-" + mode;
  if (isComplete) cls += " is-in-wishlist";
  if (isPartial) cls += " is-partial-wishlist";

  return '<button class="' + cls + '"' +
    ' type="button"' +
    ' title="' + label + '"' +
    ' aria-label="' + label + '"' +
    ' aria-pressed="' + (isComplete ? "true" : "false") + '"' +
    ' data-wishlist-engine="' + engine + '"' +
    ' data-wishlist-id="' + String(id) + '"' +
    ' data-wishlist-mode="' + mode + '">' +
    '<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">' +
    '<path d="M4.2 5.2h2.1l1.7 9.1a1.7 1.7 0 0 0 1.7 1.4h7.5a1.7 1.7 0 0 0 1.6-1.2l1.2-5.3H7.2"></path>' +
    '<circle cx="10" cy="19" r="1.2"></circle>' +
    '<circle cx="17" cy="19" r="1.2"></circle>' +
    '</svg>' +
    '</button>';
}

function renderWishlistScopeButtons(engine, id) {
  if (engine === "gearPieces" || engine === "weaponPieces" || engine === "weaponSeries") {
    return renderWishlistButton(engine, id, "default");
  }

  var scope = getWishlistPieceScopeInfo(engine, id);

  if (scope.hasArmor && scope.hasAccessory) {
    return '<span class="wishlist-mode-buttons">' +
      renderWishlistButton(engine, id, "armorOnly") +
      renderWishlistButton(engine, id, "allPieces") +
      '</span>';
  }

  return renderWishlistButton(engine, id, "allPieces");
}

function syncWishlistButtonState(button) {
  var engine = button.dataset.wishlistEngine;
  var id = button.dataset.wishlistId;
  var mode = button.dataset.wishlistMode || "default";
  var state = getWishlistTargetState(engine, id, mode);
  var isComplete = state === "complete";
  var isPartial = state === "partial";
  var actionLabel = "加入愿望单";

  if (mode === "armorOnly") {
    actionLabel = "仅添加防具";
  } else if (mode === "allPieces") {
    actionLabel = "添加全部";
  }

  var label;

  if (isComplete) {
    label = actionLabel + "：已加入，点击移除";
  } else if (isPartial) {
    label = actionLabel + "：部分已加入，点击补全";
  } else {
    label = actionLabel;
  }

  button.classList.toggle("is-in-wishlist", isComplete);
  button.classList.toggle("is-partial-wishlist", isPartial);
  button.setAttribute("title", label);
  button.setAttribute("aria-label", label);
  button.setAttribute("aria-pressed", isComplete ? "true" : "false");
}

function syncAllWishlistButtons() {
  document.querySelectorAll(".wishlist-toggle-button").forEach(syncWishlistButtonState);
}

function syncWishlistButtonsForEntity(engine, id) {
  document.querySelectorAll(".wishlist-toggle-button").forEach(button => {
    if (
      button.dataset.wishlistEngine === engine &&
      String(button.dataset.wishlistId) === String(id)
    ) {
      syncWishlistButtonState(button);
    }
  });
}

function sortItems(filteredItems) {
  const selectedSort = sortFilter.value;
  const sortedItems = [...filteredItems];
  const compareItemIdDesc = (a, b) => getNumericItemId(b) - getNumericItemId(a);
  const compareItemLevelDesc = (a, b) => (b.itemLevel || 0) - (a.itemLevel || 0);
  const compareEquipLevelDesc = (a, b) => (b.equipLevel || 0) - (a.equipLevel || 0);
  const compareListTieBreaker = (a, b) => {
    return (
      compareItemLevelDesc(a, b) ||
      compareEquipLevelDesc(a, b) ||
      compareItemIdDesc(a, b)
    );
  };

  if (selectedSort === "default") {
    return sortedItems;
  }

  if (selectedSort === "itemLevelDesc") {
    sortedItems.sort((a, b) => (
      compareItemLevelDesc(a, b) ||
      compareEquipLevelDesc(a, b) ||
      compareItemIdDesc(a, b)
    ));
  }

  if (selectedSort === "equipLevelDesc") {
    sortedItems.sort((a, b) => (
      compareEquipLevelDesc(a, b) ||
      compareItemLevelDesc(a, b) ||
      compareItemIdDesc(a, b)
    ));
  }

  if (selectedSort === "armoireFirst") {
    sortedItems.sort((a, b) => Number(b.canArmoire) - Number(a.canArmoire) || compareListTieBreaker(a, b));
  }

  if (selectedSort === "dualDyeFirst") {
    sortedItems.sort((a, b) => Number(b.canDualDye) - Number(a.canDualDye) || compareListTieBreaker(a, b));
  }

  if (selectedSort === "dresserFirst") {
    sortedItems.sort((a, b) => Number(b.canDresser) - Number(a.canDresser) || compareListTieBreaker(a, b));
  }

  if (selectedSort === "crestFirst") {
    sortedItems.sort((a, b) => Number(b.canCrest) - Number(a.canCrest) || compareListTieBreaker(a, b));
  }

  if (selectedSort === "marketFirst") {
    sortedItems.sort((a, b) => Number(b.canSellOnMarket) - Number(a.canSellOnMarket) || compareListTieBreaker(a, b));
  }

  return sortedItems;
}

function validateRangeInputs() {
  const minItemLevel = minItemLevelInput.value === ""
    ? null
    : Number(minItemLevelInput.value);

  const maxItemLevel = maxItemLevelInput.value === ""
    ? null
    : Number(maxItemLevelInput.value);

  const minEquipLevel = minEquipLevelInput.value === ""
    ? null
    : Number(minEquipLevelInput.value);

  const maxEquipLevel = maxEquipLevelInput.value === ""
    ? null
    : Number(maxEquipLevelInput.value);

  const errors = [];

  if (
    minItemLevel !== null &&
    maxItemLevel !== null &&
    minItemLevel > maxItemLevel
  ) {
    errors.push("物品品级最小值不能大于最大值");
  }

  if (
    minEquipLevel !== null &&
    maxEquipLevel !== null &&
    minEquipLevel > maxEquipLevel
  ) {
    errors.push("装备等级最小值不能大于最大值");
  }

  return errors;
}

function renderActiveFilters() {
  const filters = [];

  const keyword = searchInput.value.trim();
const selectedEquipSlot = equipSlotFilter.value;
const minItemLevel = minItemLevelInput.value;
const maxItemLevel = maxItemLevelInput.value;
const minEquipLevel = minEquipLevelInput.value;
const maxEquipLevel = maxEquipLevelInput.value;
  if (keyword !== "") {
    filters.push(`关键词：${keyword}`);
  }
  
  if (selectedEquipSlot !== "all") {
  filters.push(`装备栏：${selectedEquipSlot}`);
}

if (armorOnly.checked) {
  filters.push("只看防具");
}

if (accessoryOnly.checked) {
  filters.push("只看饰品");
}

  if (minItemLevel !== "" && maxItemLevel !== "") {
  filters.push(`品级：${minItemLevel} - ${maxItemLevel}`);
} else if (minItemLevel !== "") {
  filters.push(`最低品级：${minItemLevel}`);
} else if (maxItemLevel !== "") {
  filters.push(`最高品级：${maxItemLevel}`);
}

if (minEquipLevel !== "" && maxEquipLevel !== "") {
  filters.push(`装备等级：${minEquipLevel} - ${maxEquipLevel}`);
} else if (minEquipLevel !== "") {
  filters.push(`最低装备等级：${minEquipLevel}`);
} else if (maxEquipLevel !== "") {
  filters.push(`最高装备等级：${maxEquipLevel}`);
}

  if (sourceFilter.value !== "all") {
    filters.push(sourceFilter.options[sourceFilter.selectedIndex].text);
  }

  if (gearSetSourceCategoryFilter.value !== "all") {
    filters.push(gearSetSourceCategoryFilter.options[gearSetSourceCategoryFilter.selectedIndex].text);
  }

  if (gearSetSourceSubcategoryFilter.value !== "all") {
    filters.push(gearSetSourceSubcategoryFilter.options[gearSetSourceSubcategoryFilter.selectedIndex].text);
  }

  if (gearSetSourceDetailFilter.value !== "all") {
    filters.push(gearSetSourceDetailFilter.options[gearSetSourceDetailFilter.selectedIndex].text);
  }

  if (sortFilter.value !== "default") {
    filters.push(sortFilter.options[sortFilter.selectedIndex].text);
  }

  if (marketOnly.checked) {
  filters.push("市场板有售");
}

  filters.push(...getSelectedDyeLabels());

  if (dresserOnly.checked) {
    filters.push("可加入投影台");
  }

  if (dresserSetOnly.checked) {
  filters.push("可成套加入投影台");
}

  if (armoireOnly.checked) {
    filters.push("可进收藏柜");
  }

  if (currentEngine === "gearPieces" && crestOnly.checked) {
    filters.push("可加部队徽记");
  }

  if (gearSetDresserSetOnly.checked) {
    filters.push("可成套加入投影台");
  }

  if (gearSetLooseOnly.checked) {
    filters.push("尚未收录成套");
  }

  if (gearSetArmoireOnly.checked) {
    filters.push("可加入收藏柜");
  }

  if (gearSetNotArmoireOnly.checked) {
    filters.push("不可加入收藏柜");
  }

  if (gearSetHasModelLinksOnly.checked) {
    filters.push("有相似");
  }

  if (gearSetNoModelLinksOnly.checked) {
    filters.push("无相似");
  }

  if (currentEngine === "gearPieces" && recommendedGearOnly.checked) {
    filters.push("推荐装备");
  }

  if (filters.length === 0) {
    activeFilters.textContent = "当前筛选：全部装备";
  } else {
    activeFilters.textContent = "当前筛选：" + filters.join(" / ");
  }
}

function updateGearSetSubcategoryOptions() {
  const category = gearSetSourceCategoryFilter.value || "all";
  const options = GEAR_SET_SOURCE_GROUPS[category] || GEAR_SET_SOURCE_GROUPS.all;
  const currentValue = gearSetSourceSubcategoryFilter.value;

  gearSetSourceSubcategoryFilter.innerHTML = options
    .map(option => {
      return `<option value="${option.value}">${option.label}</option>`;
    })
    .join("");

  if (options.some(option => option.value === currentValue)) {
    gearSetSourceSubcategoryFilter.value = currentValue;
  } else {
    gearSetSourceSubcategoryFilter.value = "all";
  }

  updateGearSetDetailOptions();
}

function updateGearSetDetailOptions() {
  const group = gearSetSourceSubcategoryFilter.value || "all";
  const options = GEAR_SET_SOURCE_DETAILS[group] || [{ value: "all", label: "—" }];
  const currentValue = gearSetSourceDetailFilter.value;

  gearSetSourceDetailFilter.innerHTML = options
    .map(option => {
      return `<option value="${option.value}">${option.label}</option>`;
    })
    .join("");

  if (options.some(option => option.value === currentValue)) {
    gearSetSourceDetailFilter.value = currentValue;
  } else {
    gearSetSourceDetailFilter.value = "all";
  }
}

function renderSourceCategoryOptions() {
  const currentValue = gearSetSourceCategoryFilter.value || "all";

  gearSetSourceCategoryFilter.innerHTML = GEAR_SET_SOURCE_CATEGORIES
    .map(option => `<option value="${option.value}">${option.label}</option>`)
    .join("");

  gearSetSourceCategoryFilter.value = GEAR_SET_SOURCE_CATEGORIES.some(option => option.value === currentValue)
    ? currentValue
    : "all";
}

function updateSourceCategoryOptionLabels() {
  renderSourceCategoryOptions();
  updateGearSetSubcategoryOptions();
}

function updateSortOptionsForEngine() {
  Array.from(sortFilter.options).forEach(option => {
    if (option.dataset.gearPieceOnly === "true") {
      option.hidden = currentEngine !== "gearPieces";
      option.disabled = currentEngine !== "gearPieces";
    }
  });

  if (currentEngine !== "gearPieces" && sortFilter.value === "crestFirst") {
    sortFilter.value = "default";
  }
}

function updateFilterPanelForEngine() {
  document.body.dataset.engine = currentEngine;
  const isGearEngine = currentEngine === "gearPieces" || currentEngine === "gearSets" || currentEngine === "gearSeries";
  const isGearSetEngine = currentEngine === "gearSets";
  const isGearSeriesEngine = currentEngine === "gearSeries";
  const isWeaponPieceEngine = currentEngine === "weaponPieces";
  const isWeaponEngine = currentEngine === "weaponPieces" || currentEngine === "weaponSeries";
  const usesSourcePanel = isGearEngine || isWeaponEngine;
  const isWishlistEngine = currentEngine === "wishlist";

  gearSetFilters.classList.toggle("hidden", !usesSourcePanel || isWishlistEngine);
  equipSlotFilter.classList.toggle("hidden", isWeaponEngine || isWishlistEngine);
  weaponTypeFilter.classList.toggle("hidden", !isWeaponPieceEngine || isWishlistEngine);
  recommendToggleBar.classList.toggle("hidden", (currentEngine !== "gearPieces" && currentEngine !== "gearSets") || isWishlistEngine);
  gearPieceCategoryFilterRow.classList.toggle("hidden", isGearSetEngine || isGearSeriesEngine || isWeaponEngine || isWishlistEngine);
  weaponSlotFilterRow.classList.toggle("hidden", !isWeaponPieceEngine || isWishlistEngine);
  sourceFilter.classList.add("hidden");
  sourceFilter.setAttribute("aria-hidden", "true");
  marketOnlyFilterLabel.classList.toggle("hidden", isWishlistEngine);
  pieceGlamourFilterGroup.classList.toggle("hidden", isWishlistEngine);
  dresserOnlyFilterLabel.classList.add("hidden");
  dresserSetOnlyFilterLabel.classList.add("hidden");
  armoireOnlyFilterLabel.classList.add("hidden");
  crestOnlyFilterLabel.classList.toggle("hidden", (currentEngine !== "gearPieces" && currentEngine !== "weaponPieces") || isWishlistEngine);
  dyeScopeNote.classList.toggle("hidden", !(isGearSetEngine || isGearSeriesEngine) || isWishlistEngine);

  if (currentEngine !== "gearPieces" && currentEngine !== "weaponPieces") {
    crestOnly.checked = false;
  }

  if (!isWeaponPieceEngine) {
    mainHandOnly.checked = false;
    offHandOnly.checked = false;
  }

  updateSortOptionsForEngine();

  if (recommendedFilterLabel) {
    if (isWishlistEngine) {
      recommendedFilterLabel.textContent = "只看推荐";
    } else {
      recommendedFilterLabel.textContent = currentEngine === "gearSets"
        ? "只看推荐套装"
        : "只看推荐装备";
    }
  }

  if (similarFilterLabel) {
    if (isGearSetEngine || isGearSeriesEngine) {
      similarFilterLabel.textContent = "相似套装";
    } else if (isWeaponEngine) {
      similarFilterLabel.textContent = "相似武器";
    } else {
      similarFilterLabel.textContent = "相似装备";
    }
  }

  if (usesSourcePanel && !isWishlistEngine) {
    updateGearSetSubcategoryOptions();
  }

  if (!isWishlistEngine) {
    removeWishlistHeaderActionPanel();
  }
}

function renderWeaponInfoCard(weapon) {
  return `
    <div class="gear-info-card">
      <img class="gear-info-icon" src="${weapon.icon}" alt="${weapon.name}">
      ${renderWishlistButton("weaponPieces", weapon.id)}

      <div class="gear-info-main">
        <div class="gear-info-name">${weapon.name}</div>
        <div class="gear-info-subtitle">${weapon.type} / ${renderWeaponCategory(weapon)}</div>

        <div class="gear-info-grid">
          <div>
            <span class="info-label">品级</span>
            <span class="info-value">${weapon.itemLevel}</span>
          </div>
          <div>
            <span class="info-label">装备等级</span>
            <span class="info-value">${weapon.equipLevel}</span>
          </div>
          <div>
            <span class="info-label">对应职业</span>
            <span class="info-value">${renderWeaponJobs(weapon)}</span>
          </div>
          <div>
            <span class="info-label">武器类别</span>
            <span class="info-value">${renderWeaponCategory(weapon)}</span>
          </div>
        </div>
      </div>
    </div>
  `;
}

function cancelPreviewImageLoads(root) {
  if (!root || root.nodeType !== Node.ELEMENT_NODE) {
    return;
  }

  const images = root.matches("img")
    ? [root]
    : Array.from(root.querySelectorAll("img"));

  images.forEach(image => {
    image.dataset.cancelledSrc = image.currentSrc || image.src || image.dataset.previewSrc || "";
    image.removeAttribute("src");
    image.src = TRANSPARENT_PIXEL;
    delete image.dataset.previewLoaded;
  });
}

function activatePreviewImages(root = detailBox, version = detailPreviewVersion) {
  if (!root || version !== detailPreviewVersion) {
    return;
  }

  root.querySelectorAll("img[data-preview-src]:not([data-preview-loaded])").forEach(image => {
    if (version !== detailPreviewVersion || !root.contains(image)) {
      return;
    }

    image.dataset.previewLoaded = "true";
    image.src = image.dataset.previewSrc;
  });
}

function queuePreviewImageActivation(root = detailBox, version = detailPreviewVersion) {
  window.requestAnimationFrame(() => {
    activatePreviewImages(root, version);
  });
}

function cancelAllDetailImageLoads() {
  detailPreviewVersion += 1;
  cancelPreviewImageLoads(detailBox);
}

function getEngineLabel(engine) {
  const labels = {
    gearPieces: "装备散件",
    gearSets: "装备套装",
    gearSeries: "装备系列",
    weaponPieces: "武器散件",
    weaponSeries: "武器系列",
    wishlist: "愿望单"
  };

  return labels[engine] || engine;
}

function getEngineCount(engine) {
  if (engine === "gearPieces") {
    return items.length;
  }

  if (engine === "gearSets") {
    return mirageSets.length + customGearSets.length;
  }

  if (engine === "gearSeries") {
    return gearSeries.length;
  }

  if (engine === "weaponPieces") {
    return weaponItems.length;
  }

  if (engine === "weaponSeries") {
    return weaponSeries.length;
  }

  return 0;
}

const WISHLIST_STORAGE_KEY = "ffxivGearWishlist.v1";
const WISHLIST_FLOATING_POSITION_KEY = "ffxivGearWishlistFloatingButton.v1";
const WISHLIST_FLOATING_MARGIN = 24;
const APP_SETTINGS_STORAGE_KEY = "ffxivGearAppSettings.v1";
const FIRST_RUN_NOTICE_STORAGE_KEY = "ffxivGearFirstRunNoticeAccepted.v1";

const DEFAULT_APP_SETTINGS = {
  recommendationMode: "ask",
  cleanupReplacedItems: false,
  previewGender: "all"
};

var appSettings = loadAppSettings();

function loadAppSettings() {
  try {
    var raw = localStorage.getItem(APP_SETTINGS_STORAGE_KEY);
    if (!raw) return Object.assign({}, DEFAULT_APP_SETTINGS);
    var parsed = JSON.parse(raw);
    if (!parsed || typeof parsed !== "object") return Object.assign({}, DEFAULT_APP_SETTINGS);
    var merged = {};
    var keys = Object.keys(DEFAULT_APP_SETTINGS);
    for (var i = 0; i < keys.length; i++) {
      var k = keys[i];
      merged[k] = (parsed.hasOwnProperty(k) && parsed[k] !== undefined) ? parsed[k] : DEFAULT_APP_SETTINGS[k];
    }
    return merged;
  } catch (e) {
    return Object.assign({}, DEFAULT_APP_SETTINGS);
  }
}

function saveAppSettings(nextSettings) {
  try {
    localStorage.setItem(APP_SETTINGS_STORAGE_KEY, JSON.stringify(nextSettings));
  } catch (e) {}
}

function updateAppSettings(patch) {
  var previous = Object.assign({}, appSettings);
  Object.assign(appSettings, patch);
  saveAppSettings(appSettings);
  return previous;
}

function getAppSetting(key) {
  return appSettings.hasOwnProperty(key) ? appSettings[key] : DEFAULT_APP_SETTINGS[key];
}

function getDefaultWishlistData() {
  return { version: 1, items: [] };
}

function loadWishlistData() {
  try {
    const raw = localStorage.getItem(WISHLIST_STORAGE_KEY);
    if (!raw) {
      return getDefaultWishlistData();
    }
    const data = JSON.parse(raw);
    if (!data || typeof data !== "object" || !Array.isArray(data.items)) {
      return getDefaultWishlistData();
    }
    return data;
  } catch (e) {
    return getDefaultWishlistData();
  }
}

function saveWishlistData(data) {
  try {
    localStorage.setItem(WISHLIST_STORAGE_KEY, JSON.stringify(data));
  } catch (e) {
    // localStorage 满或不可用，静默失败
  }
}

function getWishlistEntryKey(engine, id) {
  return `${engine}|${String(id)}`;
}

function isInWishlist(engine, id) {
  const data = loadWishlistData();
  return data.items.some(entry => entry.engine === engine && String(entry.id) === String(id));
}

function addWishlistEntry(engine, id) {
  const data = loadWishlistData();
  if (isInWishlist(engine, id)) {
    return;
  }
  data.items.push({
    engine,
    id: String(id),
    addedAt: new Date().toISOString(),
    priority: "normal",
    status: "wanted",
    note: "",
    tags: []
  });
  saveWishlistData(data);
  updateWishlistFloatingButton();
}

function removeWishlistEntry(engine, id) {
  const data = loadWishlistData();
  data.items = data.items.filter(entry => {
    return !(entry.engine === engine && String(entry.id) === String(id));
  });
  saveWishlistData(data);
  updateWishlistFloatingButton();
}

function updateWishlistEntry(engine, id, patch) {
  const data = loadWishlistData();
  const entry = data.items.find(entry => {
    return entry.engine === engine && String(entry.id) === String(id);
  });
  if (entry) {
    Object.assign(entry, patch);
    saveWishlistData(data);
  }
}

function uniqueWishlistEntries(entries) {
  var seen = new Set();
  return entries.filter(function(entry) {
    var key = getWishlistEntryKey(entry.engine, entry.id);
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

function getWishlistTargetEntries(engine, id, mode) {
  mode = mode || "default";

  if (engine === "gearPieces") {
    return [{ engine: "gearPieces", id: String(id) }];
  }

  if (engine === "weaponPieces") {
    return [{ engine: "weaponPieces", id: String(id) }];
  }

  if (engine === "gearSets") {
    var set = getEntityData({ engine: "gearSets", id: id });
    if (!set || !Array.isArray(set.pieces)) return [];
    return filterWishlistEntriesByMode(
      set.pieces.map(function(piece) {
        return { engine: "gearPieces", id: String(piece.itemId), equipSlot: piece.equipSlot };
      }), mode
    );
  }

  if (engine === "customGearSets") {
    var customSet = getEntityData({ engine: "customGearSets", id: id });
    if (!customSet || !Array.isArray(customSet.pieceIds)) return [];
    return filterWishlistEntriesByMode(
      customSet.pieceIds.map(function(pid) {
        var resolved = getEntityData({ engine: "gearPieces", id: pid });
        return { engine: "gearPieces", id: String(pid), equipSlot: resolved ? resolved.equipSlot : "" };
      }), mode
    );
  }

  if (engine === "gearSeries") {
    var series = getEntityData({ engine: "gearSeries", id: id });
    if (!series) return [];
    var setItems = getGearSeriesListSetItems(series);
    var pieces = [];
    for (var i = 0; i < setItems.length; i++) {
      var setPieces = getListSetPieceItems(setItems[i]);
      for (var j = 0; j < setPieces.length; j++) {
        pieces.push(setPieces[j]);
      }
    }
    return filterWishlistEntriesByMode(
      pieces.map(function(piece) {
        return { engine: "gearPieces", id: String(piece.id), equipSlot: piece.equipSlot };
      }), mode
    );
  }

  if (engine === "weaponSeries") {
    return [{ engine: "weaponSeries", id: String(id) }];
  }

  return [];
}

function filterWishlistEntriesByMode(entries, mode) {
  var filtered = entries.filter(function(e) { return e.id && e.id !== "undefined"; });

  if (mode === "armorOnly") {
    filtered = filtered.filter(function(e) {
      return ARMOR_EQUIP_SLOTS.indexOf(e.equipSlot) !== -1;
    });
  }

  return uniqueWishlistEntries(
    filtered.map(function(e) { return { engine: e.engine, id: e.id }; })
  );
}

function getWishlistPieceScopeInfo(engine, id) {
  var allTargets = getWishlistTargetEntries(engine, id, "allPieces");
  var armorTargets = getWishlistTargetEntries(engine, id, "armorOnly");
  return {
    hasArmor: armorTargets.length > 0,
    hasAccessory: allTargets.length > armorTargets.length,
    armorTargets: armorTargets,
    allTargets: allTargets
  };
}

function getWishlistTargetState(engine, id, mode) {
  mode = mode || "default";
  var targets = getWishlistTargetEntries(engine, id, mode);
  if (targets.length === 0) return "none";

  var data = loadWishlistData();
  var wishlistKeys = new Set();
  for (var i = 0; i < data.items.length; i++) {
    wishlistKeys.add(getWishlistEntryKey(data.items[i].engine, data.items[i].id));
  }

  var includedCount = 0;
  for (var j = 0; j < targets.length; j++) {
    if (wishlistKeys.has(getWishlistEntryKey(targets[j].engine, targets[j].id))) {
      includedCount++;
    }
  }

  if (includedCount === 0) return "none";
  if (includedCount === targets.length) return "complete";
  return "partial";
}

function addWishlistTarget(engine, id, mode) {
  mode = mode || "default";
  var targets = getWishlistTargetEntries(engine, id, mode);
  var data = loadWishlistData();

  for (var i = 0; i < targets.length; i++) {
    var entry = targets[i];
    if (isInWishlist(entry.engine, entry.id)) continue;
    data.items.push({
      engine: entry.engine,
      id: String(entry.id),
      addedAt: new Date().toISOString(),
      priority: "normal",
      status: "wanted",
      note: "",
      tags: []
    });
  }

  saveWishlistData(data);
  updateWishlistFloatingButton();
}

function removeWishlistTarget(engine, id, mode) {
  mode = mode || "default";
  var targets = getWishlistTargetEntries(engine, id, mode);
  var targetKeys = new Set();
  for (var i = 0; i < targets.length; i++) {
    targetKeys.add(getWishlistEntryKey(targets[i].engine, targets[i].id));
  }

  var data = loadWishlistData();
  data.items = data.items.filter(function(entry) {
    return !targetKeys.has(getWishlistEntryKey(entry.engine, entry.id));
  });

  saveWishlistData(data);
  updateWishlistFloatingButton();
}

function toggleWishlistTarget(engine, id, mode) {
  mode = mode || "default";
  var state = getWishlistTargetState(engine, id, mode);
  if (state === "complete") {
    removeWishlistTarget(engine, id, mode);
  } else {
    addWishlistTarget(engine, id, mode);
  }
}

function getRecommendedGearPieceForWishlist(item) {
  var indexKey = getGearSameModelIndexKey(item);
  if (!indexKey) return null;

  var sameModelItems = gearItemsByModelKey[indexKey] || [];
  if (sameModelItems.length <= 1) return null;

  var sorted = sortSameModelItems(sameModelItems);
  var best = sorted[0];
  if (!best || String(best.id) === String(item.id)) return null;
  return best;
}

function getRecommendedWeaponPieceForWishlist(weapon) {
  var indexKey = getWeaponSameModelIndexKey(weapon);
  if (!indexKey) return null;

  var sameModelItems = weaponItemsByModelKey[indexKey] || [];
  if (sameModelItems.length <= 1) return null;

  var sorted = sortSameModelItems(sameModelItems);
  var best = sorted[0];
  if (!best || String(best.id) === String(weapon.id)) return null;
  return best;
}

function getRecommendedGearSetForWishlist(setItem) {
  var similarSets = getSimilarGearSetItems(setItem);
  if (similarSets.length === 0) return null;

  var sorted = sortRecommendedGearSets([setItem].concat(similarSets));
  var best = sorted[0];
  if (!best || (best.engine === setItem.engine && String(best.id) === String(setItem.id))) return null;
  return best;
}

function renderWishlistRecommendModal(currentEngine, currentId, recommendedEngine, recommendedId, mode) {
  if (!currentEngine || !currentId) return;

  var currentEntity = resolveEntity({ engine: currentEngine, id: currentId });
  var recommendedEntity = resolveEntity({ engine: recommendedEngine, id: recommendedId });
  if (!currentEntity || !recommendedEntity) return;

  var modeParam = mode || "default";
  var canCleanupOriginal = isWishlistReplaceableEngine(currentEngine) && isWishlistReplaceableEngine(recommendedEngine);
  var globalCleanupEnabled = getAppSetting("cleanupReplacedItems");
  var showCleanupOption = canCleanupOriginal && !globalCleanupEnabled;

  var html = '<div id="wishlistRecommendModal" class="wishlist-recommend-modal-overlay">' +
    '<div class="wishlist-recommend-modal">' +
    '<div class="wishlist-recommend-header">' +
    '<h3>发现更推荐的同模选择</h3>' +
    '<p>系统推荐优先加入收藏柜、染色或综合评分更好的版本。</p>' +
    '</div>' +
    '<div class="wishlist-recommend-compare">';

  // A: 原选项
  html += '<div class="wishlist-recommend-card" role="button" tabindex="0" data-wishlist-rec-choice="original" aria-pressed="false">' +
    '<div class="wishlist-recommend-label">原选项</div>';
  html += renderWishlistRecommendCard(currentEntity);
  html += '</div>';

  // B: 推荐选项
  html += '<div class="wishlist-recommend-card is-selected" role="button" tabindex="0" data-wishlist-rec-choice="recommended" aria-pressed="true">' +
    '<div class="wishlist-recommend-label wishlist-recommend-best">推荐选项</div>';
  html += renderWishlistRecommendCard(recommendedEntity);
  if (showCleanupOption) {
    html += '<label class="wishlist-recommend-cleanup-option">' +
      '<input id="wishlistRecCleanupOriginal" type="checkbox">' +
      '<span>添加推荐选项，并清除已添加的被替代选项</span>' +
      '</label>';
  }
  html += '</div>';

  html += '</div>' +
    '<div class="wishlist-recommend-actions">' +
    '<button id="wishlistRecConfirm">确定</button>' +
    '<button id="wishlistRecCancel">取消</button>' +
    '</div></div></div>';

  var overlay = document.createElement("div");
  overlay.innerHTML = html;
  document.body.appendChild(overlay.firstElementChild);

  document.getElementById("wishlistRecCancel").addEventListener("click", function() {
    closeWishlistRecommendModal();
  });

  document.querySelectorAll("#wishlistRecommendModal [data-wishlist-rec-choice]").forEach(function(card) {
    card.addEventListener("click", function() {
      document.querySelectorAll("#wishlistRecommendModal [data-wishlist-rec-choice]").forEach(function(other) {
        var selected = other === card;
        other.classList.toggle("is-selected", selected);
        other.setAttribute("aria-pressed", selected ? "true" : "false");
      });
    });

    card.addEventListener("keydown", function(event) {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        card.click();
      }
    });
  });

  var cleanupCheckbox = document.getElementById("wishlistRecCleanupOriginal");
  if (cleanupCheckbox) {
    cleanupCheckbox.addEventListener("click", function(event) {
      event.stopPropagation();
      var recommendedCard = document.querySelector("#wishlistRecommendModal [data-wishlist-rec-choice='recommended']");
      if (recommendedCard) {
        recommendedCard.click();
      }
    });
  }

  document.getElementById("wishlistRecConfirm").addEventListener("click", function() {
    var selectedCard = document.querySelector("#wishlistRecommendModal [data-wishlist-rec-choice].is-selected");
    var selectedChoice = selectedCard ? selectedCard.dataset.wishlistRecChoice : "recommended";
    var cleanupOriginal = false;
    var cleanupInput = document.getElementById("wishlistRecCleanupOriginal");
    if (selectedChoice === "recommended" && canCleanupOriginal) {
      cleanupOriginal = globalCleanupEnabled || Boolean(cleanupInput && cleanupInput.checked);
    }
    closeWishlistRecommendModal();

    if (selectedChoice === "original") {
      addWishlistTarget(currentEngine, currentId, modeParam);
      syncAllWishlistButtons();
      return;
    }

    var recEngine = recommendedEntity.engine;
    var recId = recommendedEntity.id;
    if (cleanupOriginal) {
      removeWishlistTarget(currentEngine, currentId, modeParam);
    }
    // 套装/系列 → 按mode折散件
    if (recEngine === "gearSets" || recEngine === "customGearSets" || recEngine === "gearSeries") {
      addWishlistTarget(recEngine, recId, modeParam);
    } else {
      // 散件直接加
      addWishlistEntry(recEngine, recId);
      updateWishlistFloatingButton();
    }
    syncAllWishlistButtons();
  });

  document.getElementById("wishlistRecommendModal").addEventListener("click", function(e) {
    if (e.target === this) closeWishlistRecommendModal();
  });
}

function isWishlistReplaceableEngine(engine) {
  return engine === "gearPieces" || engine === "weaponPieces" || engine === "gearSets" || engine === "customGearSets";
}

function renderWishlistRecommendCard(entity) {
  var data = entity.data || {};
  var icon = "";
  var name = "";
  var subtitle = "";
  var hasArmoire = false;
  var canDye = false;
  var canDualDye = false;
  var canDresserSet = false;
  var canCrest = false;
  var sourceText = "";
  var previewEntry = normalizePreviewEntry("");

  if (entity.engine === "gearPieces") {
    icon = data.icon || "";
    name = data.name || "";
    subtitle = (data.type || "") + " / " + (data.equipSlot || "");
    hasArmoire = data.canArmoire;
    canDye = data.canDye;
    canDualDye = data.canDualDye;
    canDresserSet = data.canDresserSet;
    canCrest = data.canCrest;
    sourceText = getSourceText(data);
    previewEntry = getPrimaryPreviewEntry(data);
  } else if (entity.engine === "weaponPieces") {
    icon = data.icon || "";
    name = data.name || "";
    subtitle = (data.weaponType || "武器") + " / " + (data.weaponSlot || "");
    hasArmoire = data.canArmoire;
    canDye = data.canDye;
    canDualDye = data.canDualDye;
    canDresserSet = false;
    canCrest = data.canCrest;
    sourceText = getSourceText(data);
    previewEntry = getPrimaryPreviewEntry(data);
  } else if (entity.engine === "gearSets") {
    icon = getOfficialGearSetIcon(entity.id);
    name = data.setName || ("套装 " + entity.id);
    subtitle = "官方套装";
    var pieces = getGearSetPieceItems(data);
    hasArmoire = representativePiecesHaveAny(pieces, "canArmoire");
    canDye = representativePiecesHaveAny(pieces, "canDye");
    canDualDye = representativePiecesHaveAny(pieces, "canDualDye");
    canDresserSet = representativePiecesHaveAny(pieces, "canDresserSet");
    sourceText = data.sourceSummary || data.source || "";
    previewEntry = getRepresentativeSetPreview(data);
  } else if (entity.engine === "customGearSets") {
    icon = getCustomGearSetIcon(data);
    name = data.name || data.id || "";
    subtitle = "自定义套装";
    var cpieces = getCustomGearSetPieceItems(data);
    hasArmoire = representativePiecesHaveAny(cpieces, "canArmoire");
    canDye = representativePiecesHaveAny(cpieces, "canDye");
    canDualDye = representativePiecesHaveAny(cpieces, "canDualDye");
    canDresserSet = representativePiecesHaveAny(cpieces, "canDresserSet");
    sourceText = data.sourceSummary || data.source || "";
    previewEntry = getRepresentativeSetPreview(data);
  } else if (entity.engine === "gearSeries") {
    icon = getGearSeriesIcon(data);
    name = data.name || entity.id || "";
    subtitle = "装备系列";
    var spieces = getGearSeriesPieceItems(data);
    hasArmoire = representativePiecesHaveAny(spieces, "canArmoire");
    canDye = representativePiecesHaveAny(spieces, "canDye");
    canDualDye = representativePiecesHaveAny(spieces, "canDualDye");
    canDresserSet = representativePiecesHaveAny(spieces, "canDresserSet");
    sourceText = data.sourceSummary || data.source || data.sourceCategory || "";
    var setItems = getGearSeriesListSetItems(data);
    for (var si = 0; si < setItems.length; si++) {
      previewEntry = getRepresentativeSetPreview(setItems[si]);
      if (hasAnyPreviewImage(previewEntry)) break;
    }
  }

  var dyeHtml = "";
  if (canDualDye) dyeHtml = '<span class="status-tag tag-dual-dye">双染</span>';
  else if (canDye) dyeHtml = '<span class="status-tag tag-dye">单染</span>';

  return '<div class="wishlist-rec-card-inner">' +
    '<div class="wishlist-rec-card-info">' +
    (icon ? '<img class="wishlist-rec-card-icon" src="' + icon + '" alt="">' : '<div class="wishlist-rec-card-icon wishlist-rec-card-icon-missing"></div>') +
    '<div class="wishlist-rec-card-body">' +
    '<strong class="wishlist-rec-card-name">' + name + '</strong>' +
    '<div class="wishlist-rec-card-subtitle">' + subtitle + '</div>' +
    '<div class="wishlist-rec-card-source">' + (sourceText || "获取方式未记录") + '</div>' +
    '<div class="tag-line wishlist-rec-card-tags">' +
    (hasArmoire ? '<span class="status-tag tag-armoire">收藏柜</span>' : '') +
    dyeHtml +
    (canDresserSet ? '<span class="status-tag tag-dresser-set">投影台</span>' : '') +
    (canCrest ? '<span class="status-tag tag-crest">部队徽记</span>' : '') +
    '</div></div></div>' +
    renderWishlistRecommendPreview(previewEntry, name) +
    '</div>';
}

function renderWishlistRecommendPreview(previewEntry, altText) {
  if (!hasAnyPreviewImage(previewEntry)) {
    return '<div class="wishlist-rec-preview wishlist-rec-preview-missing">暂无缩略图</div>';
  }

  if (previewEntry.common) {
    return '<div class="wishlist-rec-preview">' +
      '<img src="' + getPreviewThumbnailSrc(previewEntry.common) + '" alt="' + altText + ' 缩略图" loading="lazy" onerror="handlePreviewThumbError(this)">' +
      '</div>';
  }

  var html = '<div class="wishlist-rec-preview wishlist-rec-preview-split">';
  if (previewEntry.male) {
    html += '<img src="' + getPreviewThumbnailSrc(previewEntry.male) + '" alt="' + altText + ' 男缩略图" loading="lazy" onerror="handlePreviewThumbError(this)">';
  }
  if (previewEntry.female) {
    html += '<img src="' + getPreviewThumbnailSrc(previewEntry.female) + '" alt="' + altText + ' 女缩略图" loading="lazy" onerror="handlePreviewThumbError(this)">';
  }
  html += '</div>';
  return html;
}

function closeWishlistRecommendModal() {
  var modal = document.getElementById("wishlistRecommendModal");
  if (modal) modal.remove();
}

function openAppSettingsModal() {
  if (document.getElementById("appSettingsModal")) return;

  var recMode = getAppSetting("recommendationMode");
  var recAsk = recMode === "ask" ? " checked" : "";
  var recAuto = recMode === "autoReplace" ? " checked" : "";
  var recNever = recMode === "never" ? " checked" : "";
  var cleanup = getAppSetting("cleanupReplacedItems") ? " checked" : "";
  var genderAll = getAppSetting("previewGender") === "all" ? " checked" : "";
  var genderMale = getAppSetting("previewGender") === "male" ? " checked" : "";
  var genderFemale = getAppSetting("previewGender") === "female" ? " checked" : "";

  var html = '<div id="appSettingsModal" class="wishlist-recommend-modal-overlay">' +
    '<div class="wishlist-recommend-modal" style="max-width:480px;">' +
    '<h3>设置</h3>' +

    '<fieldset style="border:1px solid #d8dce5;border-radius:8px;padding:12px;margin:0 0 12px;">' +
    '<legend style="font-weight:700;padding:0 6px;">愿望单推荐</legend>' +
    '<label style="display:block;margin:0 0 6px;font-weight:normal;cursor:pointer;">' +
    '<input type="radio" name="recMode" value="ask"' + recAsk + '> 发现上位推荐时询问</label>' +
    '<label style="display:block;margin:0 0 6px;font-weight:normal;cursor:pointer;">' +
    '<input type="radio" name="recMode" value="autoReplace"' + recAuto + '> 自动使用上位推荐</label>' +
    '<label style="display:block;margin:0 0 8px;font-weight:normal;cursor:pointer;">' +
    '<input type="radio" name="recMode" value="never"' + recNever + '> 不使用上位推荐</label>' +
    '<label style="display:block;font-weight:normal;cursor:pointer;">' +
    '<input type="checkbox" id="appSettingsCleanup"' + cleanup + '> 加入推荐时清除已添加的被替代选项</label>' +
    '</fieldset>' +

    '<fieldset style="border:1px solid #d8dce5;border-radius:8px;padding:12px;margin:0 0 14px;">' +
    '<legend style="font-weight:700;padding:0 6px;">图片显示</legend>' +
    '<label style="display:block;margin:0 0 6px;font-weight:normal;cursor:pointer;">' +
    '<input type="radio" name="previewGender" value="all"' + genderAll + '> 显示全部</label>' +
    '<label style="display:block;margin:0 0 6px;font-weight:normal;cursor:pointer;">' +
    '<input type="radio" name="previewGender" value="male"' + genderMale + '> 只看男图</label>' +
    '<label style="display:block;margin:0;font-weight:normal;cursor:pointer;">' +
    '<input type="radio" name="previewGender" value="female"' + genderFemale + '> 只看女图</label>' +
    '</fieldset>' +

    '<div class="wishlist-recommend-actions">' +
    '<button id="appSettingsReset">恢复默认</button>' +
    '<button id="appSettingsCancel">取消</button>' +
    '<button id="appSettingsSave" style="background:#4f68d7;color:#fff;border-color:#4f68d7;">保存</button>' +
    '</div></div></div>';

  var overlay = document.createElement("div");
  overlay.innerHTML = html;
  document.body.appendChild(overlay.firstElementChild);

  document.getElementById("appSettingsCancel").addEventListener("click", function() {
    closeAppSettingsModal();
  });

  document.getElementById("appSettingsReset").addEventListener("click", function() {
    document.querySelector('input[name="recMode"][value="ask"]').checked = true;
    document.getElementById("appSettingsCleanup").checked = false;
    document.querySelector('input[name="previewGender"][value="all"]').checked = true;
  });

  document.getElementById("appSettingsSave").addEventListener("click", function() {
    var rec = document.querySelector('input[name="recMode"]:checked');
    var gdr = document.querySelector('input[name="previewGender"]:checked');
    var prev = updateAppSettings({
      recommendationMode: rec ? rec.value : "ask",
      cleanupReplacedItems: document.getElementById("appSettingsCleanup").checked,
      previewGender: gdr ? gdr.value : "all"
    });
    closeAppSettingsModal();
    refreshCurrentViewAfterSettingsChange(prev);
  });

  document.getElementById("appSettingsModal").addEventListener("click", function(e) {
    if (e.target === this) closeAppSettingsModal();
  });
}

function closeAppSettingsModal() {
  var modal = document.getElementById("appSettingsModal");
  if (modal) modal.remove();
}

function openInfoModal(id, title, bodyHtml) {
  if (document.getElementById(id)) return;

  var html = '<div id="' + id + '" class="wishlist-recommend-modal-overlay">' +
    '<div class="wishlist-recommend-modal app-info-modal">' +
    '<div class="wishlist-recommend-header">' +
    '<h3>' + title + '</h3>' +
    '</div>' +
    '<div class="app-info-modal-body">' + bodyHtml + '</div>' +
    '<div class="wishlist-recommend-actions">' +
    '<button data-app-info-close="' + id + '">关闭</button>' +
    '</div></div></div>';

  var overlay = document.createElement("div");
  overlay.innerHTML = html;
  document.body.appendChild(overlay.firstElementChild);

  document.querySelector('[data-app-info-close="' + id + '"]').addEventListener("click", function() {
    closeInfoModal(id);
  });

  document.getElementById(id).addEventListener("click", function(event) {
    if (event.target === this) {
      closeInfoModal(id);
    }
  });
}

async function openMarkdownInfoModal(id, title, markdownPath) {
  openInfoModal(id, title, '<p class="app-info-loading">正在加载内容...</p>');

  try {
    var response = await fetch(markdownPath);
    if (!response.ok) {
      throw new Error("读取失败：" + response.status);
    }

    var markdown = await response.text();
    var body = document.querySelector("#" + id + " .app-info-modal-body");
    if (body) {
      body.innerHTML = renderSimpleMarkdown(markdown);
    }
  } catch (error) {
    var errorBody = document.querySelector("#" + id + " .app-info-modal-body");
    if (errorBody) {
      errorBody.innerHTML = '<p class="app-info-error">内容加载失败，请检查 ' + markdownPath + '。</p>';
    }
  }
}

function escapeHtml(text) {
  return String(text || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function renderInlineMarkdown(text) {
  return escapeHtml(text)
    .replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>")
    .replace(/`([^`]+)`/g, "<code>$1</code>");
}

function renderSimpleMarkdown(markdown) {
  var lines = String(markdown || "").replace(/\r\n/g, "\n").split("\n");
  var html = "";
  var inList = false;

  function closeList() {
    if (inList) {
      html += "</ul>";
      inList = false;
    }
  }

  lines.forEach(function(line) {
    var text = line.trim();

    if (!text) {
      closeList();
      return;
    }

    if (text.indexOf("## ") === 0) {
      closeList();
      html += "<h4>" + renderInlineMarkdown(text.slice(3)) + "</h4>";
      return;
    }

    if (text.indexOf("# ") === 0) {
      closeList();
      return;
    }

    if (text.indexOf("- ") === 0) {
      if (!inList) {
        html += "<ul>";
        inList = true;
      }
      html += "<li>" + renderInlineMarkdown(text.slice(2)) + "</li>";
      return;
    }

    closeList();
    html += "<p>" + renderInlineMarkdown(text) + "</p>";
  });

  closeList();
  return html || '<p class="app-info-error">暂无内容。</p>';
}

function closeInfoModal(id) {
  var modal = document.getElementById(id);
  if (modal) modal.remove();
}

function openAppHelpModal() {
  openMarkdownInfoModal("appHelpModal", "Q&A", "docs/qa.md");
}

function openAppNoticeModal() {
  openMarkdownInfoModal("appNoticeModal", "Changelog / 反馈渠道", "docs/changelog-feedback.md");
}

function hasAcceptedFirstRunNotice() {
  try {
    return localStorage.getItem(FIRST_RUN_NOTICE_STORAGE_KEY) === "1";
  } catch (e) {
    return false;
  }
}

function saveFirstRunNoticeAccepted() {
  try {
    localStorage.setItem(FIRST_RUN_NOTICE_STORAGE_KEY, "1");
  } catch (e) {}
}

async function openFirstRunNoticeModalIfNeeded() {
  if (hasAcceptedFirstRunNotice() || document.getElementById("firstRunNoticeModal")) {
    return;
  }

  var fallbackHtml = '<p class="app-info-loading">正在加载必读内容...</p>';
  var html = '<div id="firstRunNoticeModal" class="wishlist-recommend-modal-overlay">' +
    '<div class="wishlist-recommend-modal app-info-modal app-first-run-modal">' +
    '<div class="wishlist-recommend-header">' +
    '<h3>首次使用必读</h3>' +
    '<p>请先阅读以下说明，再继续使用体验版。</p>' +
    '</div>' +
    '<div class="app-info-modal-body">' + fallbackHtml + '</div>' +
    '<div class="wishlist-recommend-actions">' +
    '<button id="firstRunNoticeAcceptButton" class="app-primary-modal-button">我已阅读并继续</button>' +
    '</div></div></div>';

  var overlay = document.createElement("div");
  overlay.innerHTML = html;
  document.body.appendChild(overlay.firstElementChild);

  document.getElementById("firstRunNoticeAcceptButton").addEventListener("click", function() {
    saveFirstRunNoticeAccepted();
    closeInfoModal("firstRunNoticeModal");
  });

  try {
    var response = await fetch("docs/first-run-notice.md");
    if (!response.ok) {
      throw new Error("读取失败：" + response.status);
    }
    var markdown = await response.text();
    var body = document.querySelector("#firstRunNoticeModal .app-info-modal-body");
    if (body) {
      body.innerHTML = renderSimpleMarkdown(markdown);
    }
  } catch (error) {
    var errorBody = document.querySelector("#firstRunNoticeModal .app-info-modal-body");
    if (errorBody) {
      errorBody.innerHTML = '<p class="app-info-error">必读内容加载失败，请检查 docs/first-run-notice.md。</p>';
    }
  }
}

function refreshCurrentViewAfterSettingsChange(prev) {
  if (!prev) return;
  if (prev.previewGender !== getAppSetting("previewGender")) {
    refreshCurrentDetailAfterSettingsChange();
    renderList();
    try { closeWishlistRecommendModal(); } catch (e) {}
  }
}

function refreshCurrentDetailAfterSettingsChange() {
  if (currentEngine === "gearPieces" && selectedItemId !== null) {
    showDetailById(selectedItemId, { renderList: false }).catch(renderDetailLoadError);
    return;
  }

  if (currentEngine === "weaponPieces" && selectedWeaponId !== null) {
    showWeaponDetailById(selectedWeaponId, { renderList: false });
    return;
  }

  if (currentEngine === "gearSets" && selectedSetRoute) {
    const entity = resolveEntity(selectedSetRoute);
    if (!entity) return;
    if (entity.engine === "gearSets") {
      renderOfficialGearSetDetail(entity.data);
    } else if (entity.engine === "customGearSets") {
      renderCustomGearSetDetail(entity.data);
    }
    updateCurrentEngineStatePatch({ detailHtml: getDetailHtmlForState() });
    return;
  }

  if (currentEngine === "gearSeries" && selectedSeriesId !== null) {
    const entity = resolveEntity({ engine: "gearSeries", id: selectedSeriesId });
    if (!entity) return;
    renderGearSeriesDetail(entity.data);
    updateCurrentEngineStatePatch({ detailHtml: getDetailHtmlForState() });
  }
}

function applyPreviewGenderPreference(previewEntry) {
  var gender = getAppSetting("previewGender");

  if (gender === "all" || !previewEntry) {
    return previewEntry;
  }

  if (previewEntry.common) {
    return {
      common: previewEntry.common,
      male: "",
      female: ""
    };
  }

  if (gender === "male") {
    return {
      common: "",
      male: previewEntry.male || "",
      female: ""
    };
  }

  if (gender === "female") {
    return {
      common: "",
      male: "",
      female: previewEntry.female || ""
    };
  }

  return previewEntry;
}

function requestToggleWishlistTarget(engine, id, mode) {
  mode = mode || "default";
  var state = getWishlistTargetState(engine, id, mode);

  // complete → 直接移除
  if (state === "complete") {
    removeWishlistTarget(engine, id, mode);
    syncAllWishlistButtons();
    return;
  }

  var recMode = getAppSetting("recommendationMode");

  // never → 不检查推荐，直接加入
  if (recMode === "never") {
    addWishlistTarget(engine, id, mode);
    syncAllWishlistButtons();
    return;
  }

  // 查找推荐目标
  var recEngine = null;
  var recId = null;

  if (engine === "gearPieces") {
    var entity = resolveEntity({ engine: engine, id: id });
    if (entity) {
      var rec = getRecommendedGearPieceForWishlist(entity.data);
      if (rec) { recEngine = "gearPieces"; recId = rec.id; }
    }
  } else if (engine === "weaponPieces") {
    var weaponEntity = resolveEntity({ engine: engine, id: id });
    if (weaponEntity) {
      var weaponRec = getRecommendedWeaponPieceForWishlist(weaponEntity.data);
      if (weaponRec) { recEngine = "weaponPieces"; recId = weaponRec.id; }
    }
  } else if (engine === "gearSets" || engine === "customGearSets") {
    var listItem = { engine: engine, id: id, data: getEntityData({ engine: engine, id: id }) };
    if (listItem.data) {
      var setRec = getRecommendedGearSetForWishlist(listItem);
      if (setRec) { recEngine = setRec.engine; recId = setRec.id; }
    }
  }

  // 无推荐 → 直接加入
  if (!recEngine) {
    addWishlistTarget(engine, id, mode);
    syncAllWishlistButtons();
    return;
  }

  // autoReplace → 自动替换
  if (recMode === "autoReplace") {
    if (getAppSetting("cleanupReplacedItems")) {
      removeWishlistTarget(engine, id, mode);
    }
    if (recEngine === "gearSets" || recEngine === "customGearSets" || recEngine === "gearSeries") {
      addWishlistTarget(recEngine, recId, mode);
    } else {
      addWishlistEntry(recEngine, recId);
      updateWishlistFloatingButton();
    }
    syncAllWishlistButtons();
    return;
  }

  // ask → 弹窗
  renderWishlistRecommendModal(engine, id, recEngine, recId, mode);
}

function getResolvedWishlistItems() {
  const data = loadWishlistData();
  return data.items
    .map(entry => {
      const entity = resolveEntity({ engine: entry.engine, id: entry.id });
      return {
        engine: entry.engine,
        id: entry.id,
        addedAt: entry.addedAt,
        priority: entry.priority,
        status: entry.status,
        note: entry.note,
        tags: entry.tags,
        entity: entity || null
      };
    })
    .filter(resolved => {
      return resolved.entity !== null;
    });
}

async function loadGilRoutePlannerData() {
  if (gilShopRouteIndex && teleportCostIndex) {
    return { gilShopRouteIndex, teleportCostIndex };
  }

  if (!gilShopRouteIndexPromise) {
    gilShopRouteIndexPromise = fetch("generated/gil-shop-route-index.json", { cache: "no-store" })
      .then(response => {
        if (!response.ok) {
          throw new Error(`读取 generated/gil-shop-route-index.json 失败：${response.status}`);
        }
        return response.json();
      })
      .then(data => {
        gilShopRouteIndex = data;
        gilShopRouteIndexPromise = null;
        return data;
      })
      .catch(error => {
        gilShopRouteIndexPromise = null;
        throw error;
      });
  }

  if (!teleportCostIndexPromise) {
    teleportCostIndexPromise = fetch("generated/teleport-cost-index.json", { cache: "no-store" })
      .then(response => {
        if (!response.ok) {
          throw new Error(`读取 generated/teleport-cost-index.json 失败：${response.status}`);
        }
        return response.json();
      })
      .then(data => {
        teleportCostIndex = data;
        teleportCostIndexPromise = null;
        return data;
      })
      .catch(error => {
        teleportCostIndexPromise = null;
        throw error;
      });
  }

  await Promise.all([gilShopRouteIndexPromise, teleportCostIndexPromise]);
  return { gilShopRouteIndex, teleportCostIndex };
}

async function loadBattleContentAliasIndex() {
  if (battleContentAliasIndex) {
    return battleContentAliasIndex;
  }

  if (!battleContentAliasIndexPromise) {
    battleContentAliasIndexPromise = fetch("generated/battle-content-alias-index.json", { cache: "no-store" })
      .then(response => {
        if (!response.ok) {
          return { aliases: {} };
        }
        return response.json();
      })
      .then(data => {
        battleContentAliasIndex = data && data.aliases ? data : { aliases: {} };
        battleContentAliasIndexPromise = null;
        return battleContentAliasIndex;
      })
      .catch(error => {
        console.warn("战斗内容别名索引读取失败：", error);
        battleContentAliasIndex = { aliases: {} };
        battleContentAliasIndexPromise = null;
        return battleContentAliasIndex;
      });
  }

  return battleContentAliasIndexPromise;
}

async function loadBattleCofferIndex() {
  if (battleCofferIndex) {
    return battleCofferIndex;
  }

  if (!battleCofferIndexPromise) {
    battleCofferIndexPromise = fetch("generated/battle-coffer-index.json", { cache: "no-store" })
      .then(response => {
        if (!response.ok) {
          return { items: {} };
        }
        return response.json();
      })
      .then(data => {
        battleCofferIndex = data && data.items ? data : { items: {} };
        battleCofferIndexPromise = null;
        return battleCofferIndex;
      })
      .catch(error => {
        console.warn("战斗装备箱索引读取失败：", error);
        battleCofferIndex = { items: {} };
        battleCofferIndexPromise = null;
        return battleCofferIndex;
      });
  }

  return battleCofferIndexPromise;
}

async function loadRecipeCraftIndex() {
  if (recipeCraftIndex) {
    return recipeCraftIndex;
  }

  if (!recipeCraftIndexPromise) {
    recipeCraftIndexPromise = fetch("generated/recipe-craft-index.json", { cache: "no-store" })
      .then(response => {
        if (!response.ok) {
          return { recipes: {} };
        }
        return response.json();
      })
      .then(data => {
        recipeCraftIndex = data && data.recipes ? data : { recipes: {} };
        recipeCraftIndexPromise = null;
        return recipeCraftIndex;
      })
      .catch(error => {
        console.warn("制作配方索引读取失败：", error);
        recipeCraftIndex = { recipes: {} };
        recipeCraftIndexPromise = null;
        return recipeCraftIndex;
      });
  }

  return recipeCraftIndexPromise;
}

async function loadNpcLocationIndex() {
  if (npcLocationIndex) {
    return npcLocationIndex;
  }

  if (!npcLocationIndexPromise) {
    npcLocationIndexPromise = fetch("generated/npc-location-index.json", { cache: "no-store" })
      .then(response => {
        if (!response.ok) {
          return { npcs: {} };
        }
        return response.json();
      })
      .then(data => {
        npcLocationIndex = data && data.npcs ? data : { npcs: {} };
        npcLocationIndexPromise = null;
        return npcLocationIndex;
      })
      .catch(error => {
        console.warn("NPC 位置索引读取失败：", error);
        npcLocationIndex = { npcs: {} };
        npcLocationIndexPromise = null;
        return npcLocationIndex;
      });
  }

  return npcLocationIndexPromise;
}

function getGilRouteAetherytes() {
  const source = teleportCostIndex && Array.isArray(teleportCostIndex.aetherytes)
    ? teleportCostIndex.aetherytes
    : (gilShopRouteIndex && Array.isArray(gilShopRouteIndex.aetherytes) ? gilShopRouteIndex.aetherytes : []);

  return source
    .filter(item => item && item.id)
    .slice()
    .sort((a, b) => {
      const nameCompare = String(a.name || "").localeCompare(String(b.name || ""), "zh-Hans-CN");
      return nameCompare || Number(a.id) - Number(b.id);
    });
}

function getTeleportCost(fromAetheryteId, toAetheryteId) {
  if (!fromAetheryteId || !toAetheryteId || String(fromAetheryteId) === String(toAetheryteId)) {
    return 0;
  }

  const costs = teleportCostIndex && teleportCostIndex.costs;
  const row = costs && costs[String(fromAetheryteId)];
  const value = row ? Number(row[String(toAetheryteId)]) : NaN;
  return Number.isFinite(value) ? value : 0;
}

function formatGil(value) {
  return `${Math.max(0, Math.round(Number(value) || 0)).toLocaleString("zh-Hans-CN")} gil`;
}

function getWishlistGilPurchasableItems(excludedItemIds) {
  const excluded = excludedItemIds || new Set();
  const indexItems = gilShopRouteIndex && gilShopRouteIndex.items ? gilShopRouteIndex.items : {};
  const resolvedItems = getResolvedWishlistItems();
  const purchasable = [];
  const unavailable = [];
  const seen = new Set();

  for (const resolvedItem of resolvedItems) {
    if (resolvedItem.status === "acquired") {
      continue;
    }

    if (resolvedItem.engine !== "gearPieces" && resolvedItem.engine !== "weaponPieces") {
      continue;
    }

    const itemId = String(resolvedItem.id);
    if (seen.has(itemId) || excluded.has(itemId)) {
      continue;
    }
    seen.add(itemId);

    const entity = resolvedItem.entity;
    const locations = Array.isArray(indexItems[itemId])
      ? indexItems[itemId].filter(location => location.nearestAetheryteId && location.npcId)
      : [];

    const item = {
      itemId,
      itemName: entity && entity.data ? entity.data.name || itemId : itemId,
      engine: resolvedItem.engine,
      locations
    };

    if (locations.length > 0) {
      purchasable.push(item);
    } else {
      unavailable.push(item);
    }
  }

  return { purchasable, unavailable };
}

function getWishlistActionStats() {
  const gilStats = gilShopRouteIndex
    ? getWishlistGilPurchasableItems(activeGilRouteExcludedItemIds)
    : { purchasable: [], unavailable: [] };

  return {
    hasGilIndex: Boolean(gilShopRouteIndex),
    gilPurchasableCount: gilStats.purchasable.length,
    battleContentCount: fullGearDataLoaded ? getWishlistBattleContentStats().itemCount : null,
    battleContentGroupCount: fullGearDataLoaded ? getWishlistBattleContentStats().groups.length : null
  };
}

function renderWishlistActionPanel() {
  const stats = getWishlistActionStats();

  return `
    <div class="wishlist-action-panel">
      <div class="wishlist-action-panel-main">
        <strong>愿望单规划</strong>
        <span>${stats.hasGilIndex ? `可路线采购 ${stats.gilPurchasableCount} 件` : "采购路径点击后计算"}；${stats.battleContentCount === null ? "打本统计点击后读取详情来源" : `打本相关 ${stats.battleContentCount} 件 / ${stats.battleContentGroupCount} 个具体内容`}。</span>
      </div>
      <div class="wishlist-action-buttons">
        <button type="button" data-open-gil-route-planner>规划采购路径</button>
        <button type="button" data-open-battle-stats>打本统计</button>
      </div>
    </div>
  `;
}

function removeWishlistHeaderActionPanel() {
  const panel = document.querySelector(".wishlist-action-panel");
  if (panel) {
    panel.remove();
  }
}

function updateWishlistHeaderActionPanel() {
  if (currentEngine !== "wishlist") {
    removeWishlistHeaderActionPanel();
    return;
  }

  if (!topFilterBox) {
    return;
  }

  const html = renderWishlistActionPanel();
  const existing = topFilterBox.querySelector(".wishlist-action-panel");
  if (existing) {
    existing.outerHTML = html;
  } else {
    topFilterBox.insertAdjacentHTML("afterbegin", html);
  }
}

function isBattleContentSource(source) {
  if (!source) {
    return false;
  }

  const text = [
    source.routeType,
    source.method,
    source.category,
    source.subCategory,
    source.type,
    source.subType,
    source.detail,
    source.contentName
  ].filter(Boolean).join(" ");

  return source.category === "battleContent" ||
    /副本|宝箱|掉落|讨伐|歼灭|团队任务|大型任务|零式|raid/i.test(text);
}

function getBattleContentName(source) {
  const contentName = source.contentName || "";
  const detail = source.detail || "";

  if (contentName && detail && contentName !== detail) {
    return `${contentName} - ${detail}`;
  }

  return contentName || detail || source.contentId || "未命名战斗内容";
}

function normalizeBattleAliasKey(value) {
  return String(value || "").replace(/\s+/g, "");
}

function resolveBattleContentAlias(value) {
  const aliases = battleContentAliasIndex && battleContentAliasIndex.aliases;
  const key = normalizeBattleAliasKey(value);

  if (!aliases || !key) {
    return "";
  }

  return aliases[key] || "";
}

function getExchangeContentName(source, lowTokenKey = "") {
  const detail = source.detail || "";
  const tokenAliasName = resolveBattleContentAlias(lowTokenKey);
  if (tokenAliasName) {
    return tokenAliasName;
  }

  const parenthesized = detail.match(/（([^）]+)）/);

  if (parenthesized && parenthesized[1]) {
    return resolveBattleContentAlias(parenthesized[1]) || parenthesized[1];
  }

  const contentName = source.contentName || "";
  const aliasName = resolveBattleContentAlias(contentName || detail);

  return aliasName || contentName || detail || (lowTokenKey ? `${lowTokenKey}兑换` : "") || source.contentId || "未命名战斗内容";
}

function isRaidLikeSource(source) {
  const text = [
    source.subCategory,
    source.subType,
    source.detail,
    source.contentName,
    source.type
  ].filter(Boolean).join(" ");

  return /raid|团队任务|零式|巴哈姆特|亚历山大|欧米茄|伊甸|万魔殿|阿卡狄亚/i.test(text);
}

function getLowTokenKey(source) {
  const tokenParts = [];

  if (source.currency && /断章|低保|书|兑换|图腾|神典石|战斗记录/.test(source.currency)) {
    tokenParts.push(source.currency);
  }

  (source.costItems || []).forEach(item => {
    const name = item.name || "";
    if (/断章|低保|书|兑换|图腾|神典石|战斗记录/.test(name)) {
      tokenParts.push(name);
    }
  });

  return tokenParts[0] || "";
}

function getLowTokenAmount(source) {
  return Number(source.price || 0) ||
    (source.costItems || []).reduce((sum, cost) => sum + (Number(cost.amount) || 0), 0) ||
    1;
}

function getSourceContentConfidence(source, lowTokenKey = "") {
  const name = getExchangeContentName(source, lowTokenKey);
  let score = 0;
  if (resolveBattleContentAlias(lowTokenKey)) {
    score += 100;
  }
  if (resolveBattleContentAlias(source.contentName || "")) {
    score += 80;
  }
  if (resolveBattleContentAlias(source.detail || "")) {
    score += 80;
  }
  if (/歼殛战|歼灭战|讨灭战|讨伐战|零式|绝境战|异闻/.test(name)) {
    score += 50;
  }
  if (/品级|战斗精英|魔法导师|装备|武器/.test(name)) {
    score -= 40;
  }
  return score + name.length / 100;
}

function isLowTokenExchangeSource(source) {
  if (!source) {
    return false;
  }

  const text = [
    source.type,
    source.subType,
    source.routeType,
    source.method,
    source.detail
  ].filter(Boolean).join(" ");

  return Boolean(getLowTokenKey(source)) || /NPC兑换|兑换|低保/i.test(text);
}

function getInferredBattleCofferSources(item, contentName = "") {
  const itemId = item && item.id !== undefined ? String(item.id) : "";
  const entries = battleCofferIndex && battleCofferIndex.items ? battleCofferIndex.items[itemId] : null;
  if (!entries || entries.length === 0) {
    return [];
  }

  return entries.map(entry => ({
    sourceProvider: "battle-coffer-index",
    category: "battleContent",
    subCategory: "raid",
    type: "副本宝箱",
    subType: "装备箱",
    routeType: "instanceCoffer",
    method: "open",
    contentName,
    containerItem: {
      id: entry.containerItemId,
      name: entry.containerName
    }
  }));
}

function getBattleGroupDescriptor(source, itemSources = []) {
  const lowTokenKey = getLowTokenKey(source);

  if (lowTokenKey && isLowTokenExchangeSource(source)) {
    const contentName = getExchangeContentName(source, lowTokenKey);
    return {
      key: `content|${contentName}`,
      contentId: "",
      contentName
    };
  }

  const contentName = getBattleContentName(source);
  const contentId = source.contentId || "";

  return {
    key: `${contentId}|${contentName}`,
    contentId,
    contentName
  };
}

function getOrCreateBattleGroup(groups, descriptor) {
  if (!groups.has(descriptor.key)) {
    groups.set(descriptor.key, {
      key: descriptor.key,
      contentId: descriptor.contentId,
      contentName: descriptor.contentName,
      subTypes: new Set(),
      isRaidLike: false,
      items: new Map(),
      coffers: new Map(),
      lowTokenItems: new Map(),
      directDropItems: new Set()
    });
  }

  const group = groups.get(descriptor.key);
  const existingName = group.contentName || "";
  if (descriptor.contentName && (!existingName || (!/（/.test(existingName) && /（/.test(descriptor.contentName)))) {
    group.contentName = descriptor.contentName;
  }

  return group;
}

function addWishlistBattleItemToGroup(group, resolvedItem, item, sources) {
  const itemId = String(resolvedItem.id);
  const existing = group.items.get(itemId) || {
    itemId,
    itemName: item.name || resolvedItem.id,
    equipSlot: item.equipSlot || item.weaponSlot || "",
    methods: new Map(),
    alternativeContentNames: new Set()
  };

  sources.forEach(source => {
    if (source.subType) {
      group.subTypes.add(source.subType);
    }
    group.isRaidLike = group.isRaidLike || isRaidLikeSource(source);

    if (source.containerItem && source.containerItem.name) {
      const cofferName = source.containerItem.name;
      const cofferKey = `${itemId}|${cofferName}`;
      if (!group.coffers.has(cofferKey)) {
        group.coffers.set(cofferKey, {
          name: cofferName,
          itemName: item.name || resolvedItem.id
        });
      }
      existing.methods.set(`coffer|${cofferName}`, `装备箱：${cofferName}`);
    } else if (!isLowTokenExchangeSource(source) && /drop|掉落/i.test(`${source.routeType || ""} ${source.type || ""} ${source.method || ""}`)) {
      group.directDropItems.add(itemId);
      existing.methods.set("directDrop", "直接掉落");
    }

    const lowTokenKey = getLowTokenKey(source);
    if (lowTokenKey) {
      const amount = getLowTokenAmount(source);
      const tokenItemKey = `${itemId}|${lowTokenKey}`;
      const previous = group.lowTokenItems.get(tokenItemKey);
      const nextAmount = previous ? Math.min(previous.amount, amount) : amount;
      group.lowTokenItems.set(tokenItemKey, {
        name: lowTokenKey,
        amount: nextAmount,
        itemName: item.name || resolvedItem.id
      });
      existing.methods.set(`token|${lowTokenKey}`, `低保兑换：${lowTokenKey} × ${nextAmount}`);
    }
  });

  if (existing.methods.size === 0) {
    existing.methods.set("source", "战斗内容来源");
  }

  group.items.set(itemId, existing);
}

function getBattleStatsSourcePriority(source) {
  if (source.containerItem && source.containerItem.name) {
    return 300;
  }

  if (!isLowTokenExchangeSource(source) && /drop|掉落/i.test(`${source.routeType || ""} ${source.type || ""} ${source.method || ""}`)) {
    return 260;
  }

  if (isLowTokenExchangeSource(source)) {
    return 180;
  }

  return 100;
}

function getBattleStatsCandidate(source, sources) {
  const lowTokenKey = getLowTokenKey(source);
  const descriptor = getBattleGroupDescriptor(source, sources);
  const confidence = getSourceContentConfidence(source, lowTokenKey);
  const priority = getBattleStatsSourcePriority(source);

  return {
    source,
    descriptor,
    score: priority + confidence
  };
}

function chooseWishlistBattlePrimarySources(item, sources) {
  const candidates = sources
    .map(source => getBattleStatsCandidate(source, sources))
    .filter(candidate => candidate.descriptor && candidate.descriptor.contentName);

  if (candidates.length === 0) {
    return null;
  }

  candidates.sort((a, b) => {
    return b.score - a.score ||
      String(a.descriptor.contentName).localeCompare(String(b.descriptor.contentName), "zh-Hans-CN");
  });

  const primary = candidates[0];
  const primaryKey = primary.descriptor.key;
  const primaryContentName = primary.descriptor.contentName;
  const chosenSources = sources.filter(source => {
    const descriptor = getBattleGroupDescriptor(source, sources);
    return descriptor.key === primaryKey;
  });
  const alternativeContentNames = Array.from(new Set(
    candidates
      .map(candidate => candidate.descriptor.contentName)
      .filter(contentName => contentName && contentName !== primaryContentName)
  )).sort((a, b) => a.localeCompare(b, "zh-Hans-CN"));

  return {
    descriptor: primary.descriptor,
    sources: [
      ...chosenSources,
      ...getInferredBattleCofferSources(item, primaryContentName)
    ],
    alternativeContentNames
  };
}

function addAlternativeBattleContentNames(group, resolvedItem, names) {
  if (!names || names.length === 0) {
    return;
  }

  const itemId = String(resolvedItem.id);
  const existing = group.items.get(itemId);
  if (!existing) {
    return;
  }

  if (!existing.alternativeContentNames) {
    existing.alternativeContentNames = new Set();
  }

  names.forEach(name => {
    if (name) {
      existing.alternativeContentNames.add(name);
    }
  });
}

function getWishlistBattleContentStats() {
  const groups = new Map();
  const resolvedItems = getResolvedWishlistItems();
  const seenItems = new Set();

  for (const resolvedItem of resolvedItems) {
    if (resolvedItem.status === "acquired") {
      continue;
    }

    if (resolvedItem.engine !== "gearPieces" && resolvedItem.engine !== "weaponPieces") {
      continue;
    }

    const entity = resolvedItem.entity;
    const item = entity && entity.data;
    if (!item || seenItems.has(String(resolvedItem.id))) {
      continue;
    }

    const sources = Array.isArray(item.sources) ? item.sources.filter(isBattleContentSource) : [];
    if (sources.length === 0) {
      continue;
    }

    seenItems.add(String(resolvedItem.id));

    const primaryPlan = chooseWishlistBattlePrimarySources(item, sources);
    if (!primaryPlan) {
      continue;
    }

    const group = getOrCreateBattleGroup(groups, primaryPlan.descriptor);
    addWishlistBattleItemToGroup(group, resolvedItem, item, primaryPlan.sources);
    addAlternativeBattleContentNames(group, resolvedItem, primaryPlan.alternativeContentNames);
  }

  const orderedGroups = Array.from(groups.values()).map(group => ({
    ...group,
    subTypes: Array.from(group.subTypes),
    items: Array.from(group.items.values()).map(item => ({
      ...item,
      methods: Array.from(item.methods.values()),
      alternativeContentNames: Array.from(item.alternativeContentNames || [])
    })).sort((a, b) => a.itemName.localeCompare(b.itemName, "zh-Hans-CN")),
    coffers: Array.from(group.coffers.values()).reduce((coffers, cofferItem) => {
      const coffer = coffers.get(cofferItem.name) || { name: cofferItem.name, count: 0, items: [] };
      coffer.count += 1;
      coffer.items.push(cofferItem.itemName);
      coffers.set(cofferItem.name, coffer);
      return coffers;
    }, new Map()),
    lowTokens: Array.from(group.lowTokenItems.values()).reduce((tokens, tokenItem) => {
      const token = tokens.get(tokenItem.name) || { name: tokenItem.name, count: 0, items: [] };
      token.count += tokenItem.amount;
      token.items.push(tokenItem.itemName);
      tokens.set(tokenItem.name, token);
      return tokens;
    }, new Map()),
    directDropCount: group.directDropItems.size
  })).map(group => ({
    ...group,
    coffers: Array.from(group.coffers.values()).sort((a, b) => b.count - a.count || a.name.localeCompare(b.name, "zh-Hans-CN")),
    lowTokens: Array.from(group.lowTokens.values()).sort((a, b) => b.count - a.count || a.name.localeCompare(b.name, "zh-Hans-CN"))
  })).sort((a, b) => b.items.length - a.items.length || a.contentName.localeCompare(b.contentName, "zh-Hans-CN"));

  return {
    groups: orderedGroups,
    itemCount: seenItems.size
  };
}

function renderBattleStatsLoadingModal() {
  const previous = document.getElementById("battleStatsModal");
  if (previous) previous.remove();

  document.body.insertAdjacentHTML("beforeend", `
    <div id="battleStatsModal" class="wishlist-recommend-modal-overlay">
      <div class="wishlist-recommend-modal battle-stats-modal">
        <div class="wishlist-recommend-header">
          <h3>打本统计</h3>
          <p>正在读取详情页完整来源数据。</p>
        </div>
        <div class="empty-result">
          <p>正在统计具体副本。</p>
        </div>
      </div>
    </div>
  `);
}

async function openWishlistBattleStatsModal() {
  renderBattleStatsLoadingModal();

  try {
    await loadFullGearData();
    if (!weaponDataLoaded) {
      await loadWeaponData();
    }
    await loadBattleContentAliasIndex();
    await loadBattleCofferIndex();
  } catch (error) {
    console.error("打本统计详情数据读取失败：", error);
    const modal = document.querySelector("#battleStatsModal .wishlist-recommend-modal");
    if (modal) {
      modal.innerHTML = `
        <div class="wishlist-recommend-header">
          <h3>打本统计</h3>
          <p>详情数据读取失败，暂时无法按具体副本统计。</p>
        </div>
        <div class="empty-result">
          <p>${escapeHtml(error.message || String(error))}</p>
        </div>
        <div class="wishlist-recommend-actions">
          <button id="battleStatsCloseButton" type="button">关闭</button>
        </div>
      `;
      document.getElementById("battleStatsCloseButton").addEventListener("click", closeWishlistBattleStatsModal);
    }
    return;
  }

  const stats = getWishlistBattleContentStats();
  const previous = document.getElementById("battleStatsModal");
  if (previous) previous.remove();

  const body = renderWishlistBattleStats(stats);
  const html = `
    <div id="battleStatsModal" class="wishlist-recommend-modal-overlay">
      <div class="wishlist-recommend-modal battle-stats-modal">
        <div class="wishlist-recommend-header">
          <h3>打本统计</h3>
          <p>按愿望单里尚未完成的装备/武器散件来源聚合。</p>
        </div>
        <div class="battle-stats-body">${body}</div>
        <div class="wishlist-recommend-actions">
          <button id="battleStatsCloseButton" type="button">关闭</button>
        </div>
      </div>
    </div>
  `;

  document.body.insertAdjacentHTML("beforeend", html);
  document.getElementById("battleStatsCloseButton").addEventListener("click", closeWishlistBattleStatsModal);
  document.getElementById("battleStatsModal").addEventListener("click", event => {
    if (event.target.id === "battleStatsModal") {
      closeWishlistBattleStatsModal();
    }
  });
}

function closeWishlistBattleStatsModal() {
  const modal = document.getElementById("battleStatsModal");
  if (modal) modal.remove();
}

function renderWishlistBattleStats(stats) {
  if (!stats || stats.groups.length === 0) {
    return `
      <div class="empty-result">
        <p>当前愿望单没有可统计的打本来源。</p>
        <p class="empty-result-tip">仅统计副本掉落、副本宝箱、团队任务、大型任务、讨伐歼灭战等战斗内容来源。</p>
      </div>
    `;
  }

  const groupHtml = stats.groups.map(group => {
    const rewardEntries = [
      ...group.coffers.map(coffer => `装备箱：${coffer.name} × ${coffer.count}`),
      ...group.lowTokens.map(token => `低保：${token.name} × ${token.count}`)
    ];
    const rewardHtml = rewardEntries.length > 0
      ? `
        <div class="battle-stats-rewards">
          <h4>获取方式</h4>
          <ul>${rewardEntries.map((entry, index) => `<li>${index > 0 ? "和 " : ""}${escapeHtml(entry)}</li>`).join("")}</ul>
        </div>
      `
      : "";

    const itemHtml = group.items.map(item => {
      const meta = [item.equipSlot, ...(item.methods || [])].filter(Boolean).join(" / ");
      const alternatives = item.alternativeContentNames && item.alternativeContentNames.length > 0
        ? `另可来自：${item.alternativeContentNames.join(" / ")}`
        : "";
      return `
        <li>
          <span>${escapeHtml(item.itemName)}</span>
          <span>${escapeHtml([meta, alternatives].filter(Boolean).join("；"))}</span>
        </li>
      `;
    }).join("");

    return `
      <section class="battle-stats-group">
        <div class="battle-stats-title">
          <span>${escapeHtml(group.contentName)}</span>
          <strong>${group.items.length} 件</strong>
        </div>
        <div class="battle-stats-meta">
          ${group.subTypes.length ? escapeHtml(group.subTypes.join(" / ")) : "战斗内容"}
          ${group.isRaidLike ? " / raid统计" : ""}
          ${group.directDropCount ? ` / 直接掉落 ${group.directDropCount} 件` : ""}
        </div>
        ${rewardHtml ? `<div class="battle-stats-columns">${rewardHtml}</div>` : ""}
        <details class="battle-stats-items">
          <summary>${rewardHtml ? "查看本内容愿望单物品" : "直接掉落/来源物品"}</summary>
          <ul>${itemHtml}</ul>
        </details>
      </section>
    `;
  }).join("");

  return `
    <div class="battle-stats-summary">
      <div><strong>${stats.itemCount}</strong><span>打本相关物品</span></div>
      <div><strong>${stats.groups.length}</strong><span>内容/副本</span></div>
    </div>
    <div class="battle-stats-list">${groupHtml}</div>
  `;
}

function buildGilPurchaseStations(purchasableItems) {
  const stationMap = new Map();

  purchasableItems.forEach((item, itemIndex) => {
    item.locations.forEach(location => {
      const key = `${location.nearestAetheryteId}|${location.npcId}|${location.shopId}`;
      if (!stationMap.has(key)) {
        stationMap.set(key, {
          key,
          nearestAetheryteId: String(location.nearestAetheryteId),
          nearestAetheryteName: location.nearestAetheryteName || "",
          npcId: String(location.npcId),
          npcName: location.npcName || "",
          shopId: String(location.shopId),
          shopName: location.shopName || "",
          placeName: location.placeName || "",
          x: location.x,
          y: location.y,
          itemMap: new Map()
        });
      }

      const station = stationMap.get(key);
      const existing = station.itemMap.get(item.itemId);
      if (!existing || Number(location.price || 0) < Number(existing.price || 0)) {
        station.itemMap.set(item.itemId, {
          itemIndex,
          itemId: item.itemId,
          itemName: item.itemName || location.itemName || item.itemId,
          price: Number(location.price || 0)
        });
      }
    });
  });

  return Array.from(stationMap.values()).map(station => {
    const buyableItems = Array.from(station.itemMap.values());
    let mask = 0;
    buyableItems.forEach(item => {
      mask |= (1 << item.itemIndex);
    });
    return {
      ...station,
      buyableItems,
      itemMask: mask
    };
  });
}

function summarizeGilRouteStep(previousAetheryteId, station, remainingMask) {
  const buyItems = station.buyableItems.filter(item => {
    return (remainingMask & (1 << item.itemIndex)) !== 0;
  });
  const purchaseCost = buyItems.reduce((sum, item) => sum + Number(item.price || 0), 0);
  const teleportCost = getTeleportCost(previousAetheryteId, station.nearestAetheryteId);

  return {
    station,
    fromAetheryteId: String(previousAetheryteId),
    toAetheryteId: String(station.nearestAetheryteId),
    teleportCost,
    purchaseCost,
    items: buyItems
  };
}

function planGilPurchaseRoute(startAetheryteId, excludedItemIds) {
  const { purchasable, unavailable } = getWishlistGilPurchasableItems(excludedItemIds);

  if (purchasable.length === 0) {
    return {
      steps: [],
      purchasable,
      unavailable,
      teleportTotal: 0,
      purchaseTotal: 0,
      total: 0,
      usedGreedy: false
    };
  }

  const stations = buildGilPurchaseStations(purchasable);
  const itemCount = purchasable.length;
  const fullMask = (1 << itemCount) - 1;

  if (itemCount > 20) {
    return planGilPurchaseRouteGreedy(startAetheryteId, purchasable, unavailable, stations, fullMask);
  }

  const startKey = `0|${String(startAetheryteId)}`;
  const states = new Map([[startKey, {
    mask: 0,
    aetheryteId: String(startAetheryteId),
    cost: 0,
    steps: []
  }]]);

  for (let guard = 0; guard <= itemCount; guard++) {
    const currentStates = Array.from(states.values());
    for (const state of currentStates) {
      if (state.mask === fullMask) {
        continue;
      }

      for (const station of stations) {
        const remainingMask = station.itemMask & ~state.mask;
        if (!remainingMask) {
          continue;
        }

        const step = summarizeGilRouteStep(state.aetheryteId, station, remainingMask);
        const nextMask = state.mask | remainingMask;
        const nextAetheryteId = String(station.nearestAetheryteId);
        const nextCost = state.cost + step.teleportCost + step.purchaseCost;
        const nextKey = `${nextMask}|${nextAetheryteId}`;
        const previous = states.get(nextKey);

        if (!previous || nextCost < previous.cost) {
          states.set(nextKey, {
            mask: nextMask,
            aetheryteId: nextAetheryteId,
            cost: nextCost,
            steps: state.steps.concat(step)
          });
        }
      }
    }
  }

  const best = Array.from(states.values())
    .filter(state => state.mask === fullMask)
    .sort((a, b) => a.cost - b.cost)[0];

  const steps = best ? best.steps : [];
  const teleportTotal = steps.reduce((sum, step) => sum + step.teleportCost, 0);
  const purchaseTotal = steps.reduce((sum, step) => sum + step.purchaseCost, 0);

  return {
    steps,
    purchasable,
    unavailable,
    teleportTotal,
    purchaseTotal,
    total: teleportTotal + purchaseTotal,
    usedGreedy: false
  };
}

function planGilPurchaseRouteGreedy(startAetheryteId, purchasable, unavailable, stations, fullMask) {
  let currentAetheryteId = String(startAetheryteId);
  let mask = 0;
  const steps = [];

  while (mask !== fullMask) {
    let best = null;

    for (const station of stations) {
      const remainingMask = station.itemMask & ~mask;
      if (!remainingMask) {
        continue;
      }

      const step = summarizeGilRouteStep(currentAetheryteId, station, remainingMask);
      const itemCount = step.items.length || 1;
      const score = (step.teleportCost + step.purchaseCost) / itemCount;

      if (!best || score < best.score) {
        best = { station, step, remainingMask, score };
      }
    }

    if (!best) {
      break;
    }

    steps.push(best.step);
    mask |= best.remainingMask;
    currentAetheryteId = String(best.station.nearestAetheryteId);
  }

  const teleportTotal = steps.reduce((sum, step) => sum + step.teleportCost, 0);
  const purchaseTotal = steps.reduce((sum, step) => sum + step.purchaseCost, 0);

  return {
    steps,
    purchasable,
    unavailable,
    teleportTotal,
    purchaseTotal,
    total: teleportTotal + purchaseTotal,
    usedGreedy: true
  };
}

function renderGilRoutePlannerModal(selectedAetheryteId) {
  const aetherytes = getGilRouteAetherytes();
  const defaultAetheryteId = selectedAetheryteId || (aetherytes[0] ? String(aetherytes[0].id) : "");
  const options = aetherytes.map(item => {
    return `<option value="${escapeAttribute(item.id)}">${escapeHtml(item.name || item.id)}</option>`;
  }).join("");

  const html = `
    <div id="gilRoutePlannerModal" class="wishlist-recommend-modal-overlay">
      <div class="wishlist-recommend-modal gil-route-modal">
        <div class="wishlist-recommend-header">
          <h3>规划采购路径</h3>
          <p>只规划愿望单中可由地图 ENPC 用 gil 购买、且尚未标记完成的装备/武器散件。</p>
        </div>
        <div class="gil-route-controls">
          <label>
            当前最近以太之光
            <select id="gilRouteStartAetheryte">${options}</select>
          </label>
          <button id="gilRouteReplanButton" type="button">开始规划</button>
        </div>
        <div id="gilRoutePlannerBody" class="gil-route-body">
          <div class="empty-result">
            <p>请选择当前最近以太之光，然后开始规划。</p>
          </div>
        </div>
        <div class="wishlist-recommend-actions">
          <button id="gilRouteCloseButton" type="button">关闭</button>
        </div>
      </div>
    </div>
  `;

  const previous = document.getElementById("gilRoutePlannerModal");
  if (previous) previous.remove();
  document.body.insertAdjacentHTML("beforeend", html);

  const select = document.getElementById("gilRouteStartAetheryte");
  if (select && defaultAetheryteId) {
    select.value = defaultAetheryteId;
  }

  document.getElementById("gilRouteCloseButton").addEventListener("click", closeGilRoutePlannerModal);
  document.getElementById("gilRouteReplanButton").addEventListener("click", updateGilRoutePlannerResult);
  document.getElementById("gilRoutePlannerModal").addEventListener("click", event => {
    if (event.target.id === "gilRoutePlannerModal") {
      closeGilRoutePlannerModal();
      return;
    }

    const removeButton = event.target.closest("[data-gil-route-exclude]");
    if (removeButton) {
      event.preventDefault();
      activeGilRouteExcludedItemIds.add(String(removeButton.dataset.gilRouteExclude));
      updateGilRoutePlannerResult();
    }
  });

  updateGilRoutePlannerResult();
}

function closeGilRoutePlannerModal() {
  const modal = document.getElementById("gilRoutePlannerModal");
  if (modal) modal.remove();
}

function updateGilRoutePlannerResult() {
  const select = document.getElementById("gilRouteStartAetheryte");
  const body = document.getElementById("gilRoutePlannerBody");
  if (!select || !body) {
    return;
  }

  const plan = planGilPurchaseRoute(select.value, activeGilRouteExcludedItemIds);
  body.innerHTML = renderGilRoutePlannerResult(plan);
}

function renderGilRoutePlannerResult(plan) {
  if (!plan || plan.purchasable.length === 0) {
    return `
      <div class="empty-result">
        <p>当前愿望单里没有可路线采购的 gil 商人装备/武器。</p>
        <p class="empty-result-tip">已完成条目、套装/系列条目、无地图购买点条目不会进入路线。</p>
      </div>
    `;
  }

  const excludedCount = activeGilRouteExcludedItemIds.size;
  const summary = `
    <div class="gil-route-summary">
      <div><strong>${formatGil(plan.teleportTotal)}</strong><span>传送费</span></div>
      <div><strong>${formatGil(plan.purchaseTotal)}</strong><span>装备购买费</span></div>
      <div><strong>${formatGil(plan.total)}</strong><span>合计</span></div>
    </div>
    <div class="gil-route-note">
      可采购 ${plan.purchasable.length} 件；不可 gil 路线采购 ${plan.unavailable.length} 件；已从本次路线移除 ${excludedCount} 件。传送费按每次传送计算，同一以太之光连续采购不会重复收费。${plan.usedGreedy ? "条目较多，当前使用贪心近似路线。" : ""}
    </div>
  `;

  const steps = plan.steps.map((step, index) => {
    const itemRows = step.items.map(item => `
      <li>
        <span>${escapeHtml(item.itemName)}</span>
        <span>${formatGil(item.price)}</span>
        <button type="button" data-gil-route-exclude="${escapeAttribute(item.itemId)}">移除</button>
      </li>
    `).join("");

    const npcLocation = [
      step.station.placeName,
      step.station.x !== null && step.station.x !== undefined && step.station.y !== null && step.station.y !== undefined
        ? `X:${step.station.x} Y:${step.station.y}`
        : ""
    ].filter(Boolean).join(" ");

    return `
      <section class="gil-route-step">
        <div class="gil-route-step-title">
          <span>${index + 1}. 传送到 ${escapeHtml(step.station.nearestAetheryteName || step.station.nearestAetheryteId)}</span>
          <strong>${formatGil(step.teleportCost)}</strong>
        </div>
        <div class="gil-route-step-meta">
          NPC：${escapeHtml(step.station.npcName || step.station.npcId)}
          ${npcLocation ? ` / ${escapeHtml(npcLocation)}` : ""}
        </div>
        <ul class="gil-route-buy-list">${itemRows}</ul>
        <div class="gil-route-step-total">本站购买：${formatGil(step.purchaseCost)}</div>
      </section>
    `;
  }).join("");

  return summary + `<div class="gil-route-steps">${steps}</div>`;
}

async function openGilRoutePlanner() {
  activeGilRouteExcludedItemIds = new Set();

  const loadingHtml = `
    <div id="gilRoutePlannerModal" class="wishlist-recommend-modal-overlay">
      <div class="wishlist-recommend-modal gil-route-modal">
        <div class="wishlist-recommend-header">
          <h3>规划采购路径</h3>
          <p>正在读取 gil 商人索引和传送费索引。</p>
        </div>
      </div>
    </div>
  `;

  const previous = document.getElementById("gilRoutePlannerModal");
  if (previous) previous.remove();
  document.body.insertAdjacentHTML("beforeend", loadingHtml);

  try {
    await loadGilRoutePlannerData();
    renderGilRoutePlannerModal();
  } catch (error) {
    console.error("采购路径数据读取失败：", error);
    const body = document.querySelector("#gilRoutePlannerModal .wishlist-recommend-modal");
    if (body) {
      body.innerHTML = `
        <div class="wishlist-recommend-header">
          <h3>规划采购路径</h3>
          <p>索引读取失败，请先运行生成脚本。</p>
        </div>
        <div class="empty-result">
          <p>${escapeHtml(error.message || String(error))}</p>
        </div>
        <div class="wishlist-recommend-actions">
          <button id="gilRouteCloseButton" type="button">关闭</button>
        </div>
      `;
      document.getElementById("gilRouteCloseButton").addEventListener("click", closeGilRoutePlannerModal);
    }
  }
}

function getWishlistCount() {
  return loadWishlistData().items.length;
}

function updateWishlistFloatingButton() {
  if (wishlistFloatingCount) {
    wishlistFloatingCount.textContent = String(getWishlistCount());
  }
}

function clampNumber(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

function getDefaultWishlistFloatingPosition() {
  return {
    side: "right",
    top: Math.max(WISHLIST_FLOATING_MARGIN, window.innerHeight - 42 - WISHLIST_FLOATING_MARGIN)
  };
}

function loadWishlistFloatingPosition() {
  try {
    const raw = localStorage.getItem(WISHLIST_FLOATING_POSITION_KEY);

    if (!raw) {
      return getDefaultWishlistFloatingPosition();
    }

    const data = JSON.parse(raw);
    const side = data && data.side === "left" ? "left" : "right";
    const top = Number(data && data.top);

    return {
      side,
      top: Number.isFinite(top) ? top : getDefaultWishlistFloatingPosition().top
    };
  } catch (error) {
    return getDefaultWishlistFloatingPosition();
  }
}

function saveWishlistFloatingPosition(position) {
  try {
    localStorage.setItem(WISHLIST_FLOATING_POSITION_KEY, JSON.stringify(position));
  } catch (error) {
    // localStorage 不可用时保持本次拖动即可。
  }
}

function applyWishlistFloatingPosition(position) {
  if (!wishlistFloatingButton) {
    return;
  }

  const buttonRect = wishlistFloatingButton.getBoundingClientRect();
  const buttonWidth = buttonRect.width || 42;
  const buttonHeight = buttonRect.height || 42;
  const maxTop = Math.max(WISHLIST_FLOATING_MARGIN, window.innerHeight - buttonHeight - WISHLIST_FLOATING_MARGIN);
  const top = clampNumber(position.top, WISHLIST_FLOATING_MARGIN, maxTop);

  wishlistFloatingButton.style.top = `${top}px`;
  wishlistFloatingButton.style.bottom = "auto";

  if (position.side === "left") {
    wishlistFloatingButton.style.left = `${WISHLIST_FLOATING_MARGIN}px`;
    wishlistFloatingButton.style.right = "auto";
  } else {
    wishlistFloatingButton.style.left = "auto";
    wishlistFloatingButton.style.right = `${WISHLIST_FLOATING_MARGIN}px`;
  }

  saveWishlistFloatingPosition({
    side: position.side === "left" ? "left" : "right",
    top
  });
}

function setupWishlistFloatingButtonDrag() {
  if (!wishlistFloatingButton) {
    return;
  }

  let dragState = null;

  wishlistFloatingButton.addEventListener("pointerdown", event => {
    if (event.button !== undefined && event.button !== 0) {
      return;
    }

    const rect = wishlistFloatingButton.getBoundingClientRect();
    dragState = {
      pointerId: event.pointerId,
      offsetX: event.clientX - rect.left,
      offsetY: event.clientY - rect.top,
      startX: event.clientX,
      startY: event.clientY,
      moved: false
    };

    wishlistFloatingButton.classList.add("is-dragging");
    wishlistFloatingButton.setPointerCapture(event.pointerId);
  });

  wishlistFloatingButton.addEventListener("pointermove", event => {
    if (!dragState || event.pointerId !== dragState.pointerId) {
      return;
    }

    const dx = event.clientX - dragState.startX;
    const dy = event.clientY - dragState.startY;

    if (Math.hypot(dx, dy) > 4) {
      dragState.moved = true;
      wishlistFloatingButton.dataset.dragMoved = "true";
    }

    const buttonRect = wishlistFloatingButton.getBoundingClientRect();
    const buttonWidth = buttonRect.width || 42;
    const buttonHeight = buttonRect.height || 42;
    const left = clampNumber(
      event.clientX - dragState.offsetX,
      WISHLIST_FLOATING_MARGIN,
      window.innerWidth - buttonWidth - WISHLIST_FLOATING_MARGIN
    );
    const top = clampNumber(
      event.clientY - dragState.offsetY,
      WISHLIST_FLOATING_MARGIN,
      window.innerHeight - buttonHeight - WISHLIST_FLOATING_MARGIN
    );

    wishlistFloatingButton.style.left = `${left}px`;
    wishlistFloatingButton.style.right = "auto";
    wishlistFloatingButton.style.top = `${top}px`;
    wishlistFloatingButton.style.bottom = "auto";
  });

  function finishDrag(event) {
    if (!dragState || event.pointerId !== dragState.pointerId) {
      return;
    }

    const rect = wishlistFloatingButton.getBoundingClientRect();
    const side = rect.left + rect.width / 2 < window.innerWidth / 2 ? "left" : "right";
    const top = rect.top;
    const didMove = dragState.moved;

    wishlistFloatingButton.classList.remove("is-dragging");
    dragState = null;
    applyWishlistFloatingPosition({ side, top });

    if (didMove) {
      window.setTimeout(() => {
        delete wishlistFloatingButton.dataset.dragMoved;
      }, 0);
    }
  }

  wishlistFloatingButton.addEventListener("pointerup", finishDrag);
  wishlistFloatingButton.addEventListener("pointercancel", finishDrag);

  window.addEventListener("resize", () => {
    applyWishlistFloatingPosition(loadWishlistFloatingPosition());
  });
}

function getOfficialGearSetIcon(setId) {
  return `images/icons/sets/set-${setId}.png`;
}

function getGearSetPieceItems(setItem) {
  return (setItem.pieces || [])
    .map(piece => {
      return getEntityData({
        engine: "gearPieces",
        id: piece.itemId
      });
    })
    .filter(Boolean);
}

function getPrimaryPreviewEntry(item) {
  if (!item || !item.previewImages) {
    return normalizePreviewEntry("");
  }

  return getPreviewImages(item).original;
}

function getRepresentativePreviewEntry(pieces, group = "original") {
  const representativePiece = pieces.find(piece => {
    return hasAnyPreviewImage(getPreviewImages(piece)[group]);
  });

  if (!representativePiece) {
    return normalizePreviewEntry("");
  }

  return getPreviewImages(representativePiece)[group];
}

function getRepresentativeSetPreview(setItem) {
  return getSetPreviewImages(setItem).original;
}

function buildPreviewImagesFromPieces(pieces) {
  const images = createEmptyPreviewImages();

  PREVIEW_IMAGE_GROUPS.forEach(group => {
    images[group] = getRepresentativePreviewEntry(pieces, group);
  });

  return images;
}

function getSetPreviewImages(setItem) {
  const entityInfo = getSetItemEntityInfo(setItem);
  const directImages = getPreviewImages(entityInfo.data);

  if (PREVIEW_IMAGE_GROUPS.some(group => hasAnyPreviewImage(directImages[group]))) {
    return directImages;
  }

  return buildPreviewImagesFromPieces(getSetItemPieceItems(entityInfo.data));
}

function getGearSeriesPreviewImages(seriesItem) {
  const directImages = getPreviewImages(seriesItem);

  if (PREVIEW_IMAGE_GROUPS.some(group => hasAnyPreviewImage(directImages[group]))) {
    return directImages;
  }

  const images = createEmptyPreviewImages();
  const setItems = getGearSeriesListSetItems(seriesItem);

  PREVIEW_IMAGE_GROUPS.forEach(group => {
    const representativeSet = setItems.find(setItem => {
      return hasAnyPreviewImage(getSetPreviewImages(setItem)[group]);
    });

    images[group] = representativeSet
      ? getSetPreviewImages(representativeSet)[group]
      : normalizePreviewEntry("");
  });

  return images;
}

function getSetItemPieceItems(setItem) {
  if (!setItem) {
    return [];
  }

  if (setItem.engine === "gearSets" || setItem.engine === "customGearSets") {
    return getListSetPieceItems(setItem);
  }

  if (setItem.setId !== undefined) {
    return getGearSetPieceItems(setItem);
  }

  if (setItem.id !== undefined && Array.isArray(setItem.pieceIds)) {
    return getCustomGearSetPieceItems(setItem);
  }

  return [];
}

function getSetItemBodyModelKey(setItem) {
  const bodyPiece = getSetItemPieceItems(setItem).find(piece => {
    return piece.equipSlot === "身体";
  });

  if (!bodyPiece) {
    return "";
  }

  return getModelCompareKey(bodyPiece);
}

var ARMOR_SLOTS = ["头部", "身体", "手部", "腿部", "脚部"];

function getSetItemArmorModelKeys(setItem) {
  var pieces = getSetItemPieceItems(setItem);
  var result = {};
  for (var i = 0; i < ARMOR_SLOTS.length; i++) {
    var slot = ARMOR_SLOTS[i];
    var piece = pieces.find(function(p) { return p.equipSlot === slot; });
    result[slot] = piece ? getModelCompareKey(piece) : "";
  }
  return result;
}

function getSlotInitial(slotName) {
  const slotMap = {
    "头部": "头",
    "身体": "身",
    "手部": "手",
    "腿部": "腿",
    "脚部": "脚",
    "耳饰": "耳",
    "项链": "项",
    "手镯": "腕",
    "戒指": "戒"
  };

  return slotMap[slotName] || slotName || "";
}

function renderPieceSlotInitials(pieces) {
  const slots = (pieces || [])
    .map(piece => piece.equipSlot)
    .filter(Boolean);
  const orderedSlots = EQUIP_SLOT_ORDER.filter(slot => slots.includes(slot));
  const extraSlots = slots.filter(slot => !EQUIP_SLOT_ORDER.includes(slot));
  const uniqueSlots = [...new Set([...orderedSlots, ...extraSlots])];

  return uniqueSlots.map(getSlotInitial).filter(Boolean).join(" / ") || "未记录";
}

function getPieceLevelRangeText(pieces, fieldName) {
  const values = pieces
    .map(piece => piece[fieldName])
    .filter(value => value !== "" && value !== undefined && value !== null)
    .map(Number)
    .filter(value => !Number.isNaN(value));

  if (values.length === 0) {
    return "未记录";
  }

  const minValue = Math.min(...values);
  const maxValue = Math.max(...values);

  return minValue === maxValue ? String(minValue) : `${minValue}-${maxValue}`;
}

function getCollectionRepresentativePieces(pieces) {
  const bodyPieces = (pieces || []).filter(piece => piece.equipSlot === "身体");

  if (bodyPieces.length > 0) {
    return bodyPieces;
  }

  return (pieces || []).filter(piece => ARMOR_EQUIP_SLOTS.includes(piece.equipSlot));
}

function representativePiecesHaveAny(pieces, fieldName) {
  const representativePieces = getCollectionRepresentativePieces(pieces);

  return representativePieces.length > 0 && representativePieces.some(piece => Boolean(piece[fieldName]));
}

function representativePiecesCanSingleDyeOnly(pieces) {
  const representativePieces = getCollectionRepresentativePieces(pieces);

  return (
    representativePieces.length > 0 &&
    representativePieces.some(piece => piece.canDye) &&
    !representativePieces.some(piece => piece.canDualDye)
  );
}

function renderSetOrSeriesInfoCard({
  icon,
  name,
  typeLabel,
  pieces,
  canDresserSet,
  canArmoire,
  note,
  sourceNote = "",
  showSlots = true,
  wishlistEngine = "",
  wishlistId = ""
}) {
  const statusItem = {
    canDye: representativePiecesHaveAny(pieces, "canDye"),
    canDualDye: representativePiecesHaveAny(pieces, "canDualDye")
  };
  const slotText = renderPieceSlotInitials(pieces);

  return `
    <div class="gear-info-card">
      ${icon ? `<img class="gear-info-icon" src="${icon}" alt="${name}">` : ""}
      ${wishlistEngine && wishlistId !== "" ? renderWishlistScopeButtons(wishlistEngine, wishlistId) : ""}

      <div class="gear-info-main">
        <div class="gear-info-name">${name}</div>
        <div class="gear-info-subtitle">类型：${typeLabel}</div>
        <div class="gear-info-summary-line">品级：${getPieceLevelRangeText(pieces, "itemLevel")} / 装备等级：${getPieceLevelRangeText(pieces, "equipLevel")}</div>
        ${showSlots ? `<div class="gear-info-summary-line">包含部位：${slotText}</div>` : ""}
        ${sourceNote ? `<div class="gear-info-source-note">${sourceNote}</div>` : ""}

        <div class="tag-line">
          ${renderAggregateArmoireTag(canArmoire)}
          ${renderDyeDots(statusItem)}
          ${renderDresserSetTag(canDresserSet)}
        </div>
      </div>
    </div>
  `;
}

function renderSetOrSeriesStatusTags({ canArmoire, canDye, canDualDye, canDresserSet }) {
  return `
    <div class="tag-line">
      ${renderAggregateArmoireTag(canArmoire)}
      ${renderDyeDots({ canDye, canDualDye })}
      ${renderDresserSetTag(canDresserSet)}
    </div>
  `;
}

function renderGearSetListStatusTags(setItem) {
  return renderSetOrSeriesStatusTags({
    canArmoire: gearSetCanArmoire(setItem),
    canDye: gearSetCanDye(setItem),
    canDualDye: gearSetCanDualDye(setItem),
    canDresserSet: gearSetCanDresserSet(setItem)
  });
}

function renderGearSeriesListStatusTags(seriesItem) {
  return renderSetOrSeriesStatusTags({
    canArmoire: gearSeriesCanArmoire(seriesItem),
    canDye: gearSeriesCanDye(seriesItem),
    canDualDye: gearSeriesCanDualDye(seriesItem),
    canDresserSet: gearSeriesCanDresserSet(seriesItem)
  });
}

function getSetItemEntityInfo(setItem) {
  if (setItem.engine === "gearSets" || setItem.engine === "customGearSets") {
    return {
      engine: setItem.engine,
      id: setItem.id,
      title: setItem.name,
      pieceCount: setItem.pieceCount,
      data: setItem.data
    };
  }

  if (setItem.setId !== undefined) {
    return {
      engine: "gearSets",
      id: setItem.setId,
      title: setItem.setName || `套装 ${setItem.setId}`,
      pieceCount: (setItem.pieces || []).length,
      data: setItem
    };
  }

  return {
    engine: "customGearSets",
    id: setItem.id,
    title: setItem.name || setItem.id,
    pieceCount: (setItem.pieceIds || []).length,
    data: setItem
  };
}

function renderSetPreviewCard(setItem, options = {}) {
  const entityInfo = getSetItemEntityInfo(setItem);
  const preview = getRepresentativeSetPreview(entityInfo.data);
  const title = entityInfo.title;
  const meta = options.meta || `包含：${renderPieceSlotInitials(getSetItemPieceItems(entityInfo.data))}`;
  const note = options.note || "";

  return `
    <div class="detail-preview-card">
      <div class="detail-preview-card-image">
        ${renderPreviewBlock(preview, title)}
      </div>
      <div class="detail-preview-card-body">
        <button
          class="gallery-link detail-preview-card-title"
          data-navigate-engine="${escapeAttribute(entityInfo.engine)}"
          data-navigate-id="${escapeAttribute(entityInfo.id)}"
        >
          ${title}
        </button>
        <div class="detail-preview-card-meta">${meta}</div>
        ${note ? `<div class="detail-preview-card-note">${note}</div>` : ""}
      </div>
    </div>
  `;
}

function getColorPreviewItems({ title, images, canDye, canDualDye, canCrest = false }) {
  const colorImages = [
    {
      label: "原色外观",
      image: images.original
    }
  ];

  if (canDye) {
    colorImages.push({
      label: "染色区域 1 示例",
      image: images.dye1
    });
  }

  if (canDualDye) {
    colorImages.push({
      label: "染色区域 2 示例",
      image: images.dye2
    });

    colorImages.push({
      label: "双染色示例",
      image: images.dyeDouble
    });
  }

  if (canCrest) {
    colorImages.push({
      label: "部队徽记效果图",
      image: images.crest
    });
  }

  return colorImages
    .filter(imageItem => hasAnyPreviewImage(imageItem.image))
    .map(imageItem => ({
      ...imageItem,
      title
    }));
}

function renderColorPreviewCards(colorImages) {
  return colorImages.map(imageItem => {
    const cardClass = hasGenderSplitImage(imageItem.image)
      ? "detail-preview-card detail-preview-card-wide"
      : "detail-preview-card";

    return `
      <div class="${cardClass}">
        <div class="detail-preview-card-image">
          ${renderPreviewBlock(imageItem.image, imageItem.label, imageItem.title)}
        </div>
        <div class="detail-preview-card-body">
          <div class="detail-preview-card-title">${imageItem.label}</div>
        </div>
      </div>
    `;
  }).join("");
}

function renderSetColorPreviewCards(setItem) {
  const entityInfo = getSetItemEntityInfo(setItem);

  return renderColorPreviewCards(getColorPreviewItems({
    title: entityInfo.title,
    images: getSetPreviewImages(entityInfo.data),
    canDye: gearSetCanDye(setItem),
    canDualDye: gearSetCanDualDye(setItem),
    canCrest: false
  }));
}

function renderGearSeriesColorPreviewCards(seriesItem) {
  return renderColorPreviewCards(getColorPreviewItems({
    title: seriesItem.name,
    images: getGearSeriesPreviewImages(seriesItem),
    canDye: gearSeriesCanDye(seriesItem),
    canDualDye: gearSeriesCanDualDye(seriesItem),
    canCrest: false
  }));
}

function getAllGearSetListItems() {
  if (_allGearSetListItems) {
    return _allGearSetListItems;
  }

  const officialSets = mirageSets
    .map(setData => makeListSetItem(setData, "gearSets"))
    .filter(setItem => getListSetPieceItems(setItem).length > 0);
  const customSets = customGearSets
    .map(setData => makeListSetItem(setData, "customGearSets"))
    .filter(setItem => getListSetPieceItems(setItem).length > 0);

  _allGearSetListItems = [...officialSets, ...customSets];
  return _allGearSetListItems;
}

function getSimilarGearSetItems(setItem) {
  var info = getSetItemEntityInfo(setItem);
  var key = `${info.engine}|${String(info.id)}`;

  return gearSetSimilarItemsByKey.get(key) || [];
}

function buildGearSetRecommendationIndex() {
  gearSetSimilarItemsByKey = new Map();
  gearSetRecommendedKeys = new Set();
  gearSetRecommendationScoreByKey = new Map();
  gearSetArmorKeysByKey = new Map();

  _allGearSetListItems = null;
  const allSets = getAllGearSetListItems();
  const parent = new Map();

  function find(key) {
    const current = parent.get(key) || key;

    if (current === key) {
      return key;
    }

    const root = find(current);
    parent.set(key, root);
    return root;
  }

  function union(a, b) {
    const rootA = find(a);
    const rootB = find(b);

    if (rootA !== rootB) {
      parent.set(rootB, rootA);
    }
  }

  function countMatchingArmorSlots(aKeys, bKeys) {
    let count = 0;

    for (const slot of ARMOR_SLOTS) {
      if (aKeys[slot] && bKeys[slot] && aKeys[slot] === bKeys[slot]) {
        count++;
      }
    }

    return count;
  }

  const setsByBodyKey = new Map();

  for (const setItem of allSets) {
    const key = getGearSetListItemKey(setItem);
    parent.set(key, key);

    const armorKeys = getSetItemArmorModelKeys(setItem);
    gearSetArmorKeysByKey.set(key, armorKeys);

    const score = getGearSetRecommendationScore(setItem);
    gearSetRecommendationScoreByKey.set(key, score);

    const bodyKey = armorKeys["身体"];

    if (!bodyKey) {
      continue;
    }

    if (!setsByBodyKey.has(bodyKey)) {
      setsByBodyKey.set(bodyKey, []);
    }

    setsByBodyKey.get(bodyKey).push(setItem);
  }

  for (const sameBodySets of setsByBodyKey.values()) {
    for (let i = 0; i < sameBodySets.length; i++) {
      const a = sameBodySets[i];
      const aKey = getGearSetListItemKey(a);
      const aKeys = gearSetArmorKeysByKey.get(aKey);

      for (let j = i + 1; j < sameBodySets.length; j++) {
        const b = sameBodySets[j];
        const bKey = getGearSetListItemKey(b);
        const bKeys = gearSetArmorKeysByKey.get(bKey);

        if (countMatchingArmorSlots(aKeys, bKeys) >= 3) {
          union(aKey, bKey);
        }
      }
    }
  }

  const groups = new Map();

  for (const setItem of allSets) {
    const key = getGearSetListItemKey(setItem);
    const root = find(key);

    if (!groups.has(root)) {
      groups.set(root, []);
    }

    groups.get(root).push(setItem);
  }

  for (const groupSets of groups.values()) {
    const best = sortRecommendedGearSets(groupSets)[0];

    if (best) {
      gearSetRecommendedKeys.add(getGearSetListItemKey(best));
    }

    for (const setItem of groupSets) {
      const key = getGearSetListItemKey(setItem);
      const similarSets = groupSets.filter(other => {
        return getGearSetListItemKey(other) !== key;
      });

      gearSetSimilarItemsByKey.set(key, similarSets);
    }
  }
}

function renderSimilarGearSetSection(setItem) {
  const similarSets = getSimilarGearSetItems(setItem);

  if (similarSets.length === 0) {
    return "";
  }

  const cards = similarSets.map(similarSet => {
    return renderSetPreviewCard(similarSet, {
      note: "防具三件以上同模（含身体）"
    });
  }).join("");

  return `
    <div class="same-set-box">
      <h4>相似套装</h4>
      <div class="detail-preview-card-grid">
        ${cards}
      </div>
    </div>
  `;
}

function renderGearSetPieceCards(pieces) {
  return pieces.map(piece => {
    const preview = getPrimaryPreviewEntry(piece);
    const meta = [
      piece.equipSlot,
      piece.itemLevel !== "" ? `品级 ${piece.itemLevel}` : ""
    ].filter(Boolean).join(" / ");

    return `
      <div class="detail-preview-card">
        <div class="detail-preview-card-image">
          ${renderPreviewBlock(preview, piece.name)}
        </div>
        <div class="detail-preview-card-body">
          <button class="gallery-link detail-preview-card-title" onclick="navigateToItem(${JSON.stringify(piece.id)})">
            ${piece.name}
          </button>
          ${meta ? `<div class="detail-preview-card-meta">${meta}</div>` : ""}
        </div>
      </div>
    `;
  }).join("");
}

function renderOfficialGearSetDetail(setItem) {
  const pieces = getGearSetPieceItems(setItem);
  const pieceCards = renderGearSetPieceCards(pieces);
  const listSetItem = makeListSetItem(setItem, "gearSets");
  const setPreviewCards = renderSetColorPreviewCards(listSetItem);

  detailBox.innerHTML = `
    ${renderSetOrSeriesInfoCard({
      icon: getOfficialGearSetIcon(setItem.setId),
      name: setItem.setName || `套装 ${setItem.setId}`,
      typeLabel: "官方套装",
      pieces,
      canDresserSet: representativePiecesHaveAny(pieces, "canDresserSet"),
      canArmoire: representativePiecesHaveAny(pieces, "canArmoire"),
      note: setItem.sourceSummary || setItem.source || "",
      sourceNote: setItem.note || "",
      wishlistEngine: "gearSets",
      wishlistId: String(setItem.setId)
    })}

    <div class="same-set-box">
      <h4>总体效果预览</h4>
      <div class="detail-preview-card-grid">
        ${setPreviewCards || renderSetPreviewCard(listSetItem)}
      </div>
    </div>

    ${renderSimilarGearSetSection(setItem)}

    <div class="same-set-box">
      <h4>套装散件</h4>
      <div class="detail-preview-card-grid">
        ${pieceCards || "<p class=\"empty-result-tip\">暂无散件数据</p>"}
      </div>
    </div>
  `;
}

function renderCustomGearSetDetail(setItem) {
  const pieces = getCustomGearSetPieceItems(setItem);
  const pieceCards = renderGearSetPieceCards(pieces);
  const icon = getCustomGearSetIcon(setItem);
  const listSetItem = makeListSetItem(setItem, "customGearSets");
  const canArmoire = representativePiecesHaveAny(pieces, "canArmoire");
  const setPreviewCards = renderSetColorPreviewCards(listSetItem);

  detailBox.innerHTML = `
    ${renderSetOrSeriesInfoCard({
      icon,
      name: setItem.name || setItem.id,
      typeLabel: "自定义套装",
      pieces,
      canDresserSet: representativePiecesHaveAny(pieces, "canDresserSet"),
      canArmoire,
      note: setItem.sourceSummary || setItem.source || "",
      sourceNote: setItem.note || "",
      wishlistEngine: "customGearSets",
      wishlistId: String(setItem.id)
    })}

    <div class="same-set-box">
      <h4>总体效果预览</h4>
      <div class="detail-preview-card-grid">
        ${setPreviewCards || renderSetPreviewCard(listSetItem)}
      </div>
    </div>

    ${renderSimilarGearSetSection(listSetItem)}

    <div class="same-set-box">
      <h4>套装散件</h4>
      <div class="detail-preview-card-grid">
        ${pieceCards || "<p class=\"empty-result-tip\">暂无散件数据</p>"}
      </div>
    </div>

    ${setItem.note ? `
      <div class="source-box">
        <div class="source-title">备注</div>
        <div class="source-simple">${setItem.note}</div>
      </div>
    ` : ""}
  `;
}

function updateSelectedSetCardHighlight() {
  resultList.querySelectorAll("[data-engine][data-id]").forEach(card => {
    const isSelectedSet =
      selectedSetRoute &&
      card.dataset.engine === selectedSetRoute.engine &&
      String(card.dataset.id) === String(selectedSetRoute.id);

    card.classList.toggle("selected-card", Boolean(isSelectedSet));
  });
}

function updateSelectedItemCardHighlight() {
  resultList.querySelectorAll("[data-engine='gearPieces'][data-id]").forEach(card => {
    card.classList.toggle("selected-card", String(card.dataset.id) === String(selectedItemId));
  });
}

function updateSelectedWeaponCardHighlight() {
  resultList.querySelectorAll("[data-engine='weaponPieces'][data-id]").forEach(card => {
    card.classList.toggle("selected-card", String(card.dataset.id) === String(selectedWeaponId));
  });
}

function updateSelectedSeriesCardHighlight() {
  resultList.querySelectorAll("[data-engine='gearSeries'][data-id]").forEach(card => {
    card.classList.toggle("selected-card", String(card.dataset.id) === String(selectedSeriesId));
  });
}

function makeListSetItem(setData, engine) {
  if (engine === "gearSets") {
    return {
      engine: "gearSets",
      id: setData.setId,
      name: setData.setName || `套装 ${setData.setId}`,
      pieceCount: (setData.pieces || []).length,
      data: setData
    };
  }

  return {
    engine: "customGearSets",
    id: setData.id,
    name: setData.name || setData.id,
    pieceCount: (setData.pieceIds || []).length,
    data: setData
  };
}

function getCustomGearSetPieceItems(customSet) {
  return (customSet.pieceIds || [])
    .map(pieceId => {
      return getEntityData({
        engine: "gearPieces",
        id: pieceId
      });
    })
    .filter(Boolean);
}

function getCustomGearSetIcon(customSet) {
  if (!customSet) {
    return "";
  }

  if (customSet.icon) {
    return customSet.icon;
  }

  const pieces = getCustomGearSetPieceItems(customSet);
  const bodyPiece = pieces.find(piece => piece.equipSlot === "身体");
  const representativePiece = bodyPiece || pieces[0];

  return representativePiece?.icon || "";
}

function getListSetPieceItems(setItem) {
  if (setItem.engine === "gearSets") {
    return getGearSetPieceItems(setItem.data);
  }

  return getCustomGearSetPieceItems(setItem.data);
}

function normalizeSearchText(parts) {
  return parts.filter(Boolean).join(" ");
}

function isAllLevelOneSet(pieces) {
  return pieces.length > 0 && pieces.every(piece => {
    return Number(piece.itemLevel) === 1 && Number(piece.equipLevel) === 1;
  });
}

function isAccessorySet(pieces) {
  return pieces.length > 0 && pieces.every(piece => ACCESSORY_SLOTS.includes(piece.equipSlot));
}

function includesAnySetKeyword(text, keywords) {
  return keywords.some(keyword => keyword && text.includes(keyword));
}

function getGearSetCategory(setItem) {
  const pieces = getListSetPieceItems(setItem);
  const searchText = normalizeSearchText([
    setItem.name,
    setItem.id,
    ...pieces.map(piece => piece.name || "")
  ]);

  if (isAllLevelOneSet(pieces)) {
    return "other";
  }

  const isAccessory = isAccessorySet(pieces);

  if (includesAnySetKeyword(searchText, CRAFT_GATHER_SET_KEYWORDS)) {
    return isAccessory ? "craftGatherAccessory" : "craftGatherArmor";
  }

  if (includesAnySetKeyword(searchText, COMBAT_SET_KEYWORDS)) {
    return isAccessory ? "combatAccessory" : "combatArmor";
  }

  return "other";
}

function gearSetMatchesCategoryFilter(setItem) {
  const selectedCategory = currentEngine === "gearSets" ? equipSlotFilter.value : "all";

  return selectedCategory === "all" || getGearSetCategory(setItem) === selectedCategory;
}

function getGearSetSourceText(setItem) {
  const pieces = getListSetPieceItems(setItem);
  const sourceParts = pieces.flatMap(piece => {
    const parts = [
      piece.sourceSummary || "",
      piece.source || "",
      ...(piece.sources || []).map(source => {
        return [
          source.category || "",
          source.subCategory || "",
          source.routeType || "",
          source.type || "",
          source.subType || "",
          source.name || "",
          source.content || "",
          source.contentName || "",
          source.detail || "",
          source.currency || "",
          source.npcName || "",
          source.note || ""
        ].filter(Boolean).join(" ");
      })
    ];

    return parts.filter(Boolean);
  });

  return [
    setItem.data.sourceCategory || "",
    ...(Array.isArray(setItem.data.sourceCategories) ? setItem.data.sourceCategories : []),
    setItem.data.sourceSubCategory || "",
    setItem.data.sourceSubcategory || "",
    ...(Array.isArray(setItem.data.sourceSubCategories) ? setItem.data.sourceSubCategories : []),
    setItem.data.sourceSummary || "",
    setItem.data.source || "",
    setItem.name,
    setItem.id,
    ...pieces.flatMap(piece => [
      piece.sourceCategory || "",
      ...(Array.isArray(piece.sourceCategories) ? piece.sourceCategories : []),
      piece.sourceSubCategory || "",
      piece.sourceSubcategory || "",
      ...(Array.isArray(piece.sourceSubCategories) ? piece.sourceSubCategories : []),
      piece.sourceSearchText || ""
    ]),
    ...sourceParts
  ].filter(Boolean).join(" ");
}

function getGearSetSourceCategory(setItem) {
  return setItem.data.sourceFilterCategory || "uncategorized";
}

function getGearSetSourceCategories(setItem) {
  const pieces = getListSetPieceItems(setItem);
  const categories = [
    ...(Array.isArray(setItem.data.sourceFilterCategories) ? setItem.data.sourceFilterCategories : []),
    setItem.data.sourceFilterCategory || "",
    ...pieces.flatMap(piece => [
      ...(Array.isArray(piece.sourceFilterCategories) ? piece.sourceFilterCategories : []),
      piece.sourceFilterCategory || ""
    ])
  ];
  const uniqueCategories = Array.from(new Set(categories.filter(Boolean)));

  if (uniqueCategories.length > 0) {
    return uniqueCategories;
  }

  return [getGearSetSourceCategory(setItem)].filter(Boolean);
}

function getGearSetSourceSubCategories(setItem) {
  const pieces = getListSetPieceItems(setItem);
  const subcategories = [
    setItem.data.sourceFilterGroup || setItem.data.sourceFilterSubCategory || "",
    setItem.data.sourceFilterGroupId || "",
    ...(Array.isArray(setItem.data.sourceFilterGroups) ? setItem.data.sourceFilterGroups : []),
    ...pieces.flatMap(piece => [
      piece.sourceFilterGroup || piece.sourceFilterSubCategory || "",
      piece.sourceFilterGroupId || "",
      ...(Array.isArray(piece.sourceFilterGroups) ? piece.sourceFilterGroups : [])
    ])
  ];

  return Array.from(new Set(subcategories.filter(Boolean)));
}

function getGearSetSourceDetails(setItem) {
  const pieces = getListSetPieceItems(setItem);
  const details = [
    setItem.data.sourceFilterSubCategory || "",
    setItem.data.sourceFilterSubcategory || "",
    ...(Array.isArray(setItem.data.sourceFilterSubCategories) ? setItem.data.sourceFilterSubCategories : []),
    ...pieces.flatMap(piece => [
      piece.sourceFilterSubCategory || "",
      piece.sourceFilterSubcategory || "",
      ...(Array.isArray(piece.sourceFilterSubCategories) ? piece.sourceFilterSubCategories : [])
    ])
  ];

  return Array.from(new Set(details.filter(Boolean)));
}

function gearSetMatchesSourceFilters(setItem) {
  const selectedCategory = gearSetSourceCategoryFilter.value;
  const selectedSubcategory = gearSetSourceSubcategoryFilter.value;
  const selectedDetail = gearSetSourceDetailFilter.value;
  const categories = getGearSetSourceCategories(setItem);
  const subcategories = getGearSetSourceSubCategories(setItem);
  const details = getGearSetSourceDetails(setItem);

  if (selectedCategory !== "all" && !categories.includes(selectedCategory)) {
    return false;
  }

  if (selectedSubcategory !== "all" && !subcategories.includes(selectedSubcategory)) {
    return false;
  }

  if (selectedDetail !== "all" && !details.includes(selectedDetail)) {
    return false;
  }

  return true;
}

function getGearSetMaxNumber(setItem, field) {
  const values = getListSetPieceItems(setItem)
    .map(piece => Number(piece[field]))
    .filter(value => Number.isFinite(value));

  if (values.length === 0) {
    return 0;
  }

  return Math.max(...values);
}

function gearSetCanArmoire(setItem) {
  const pieces = getListSetPieceItems(setItem);

  return representativePiecesHaveAny(pieces, "canArmoire");
}

function gearSetCanDye(setItem) {
  const pieces = getListSetPieceItems(setItem);

  return representativePiecesHaveAny(pieces, "canDye");
}

function gearSetCanSingleDyeOnly(setItem) {
  const pieces = getListSetPieceItems(setItem);

  return representativePiecesCanSingleDyeOnly(pieces);
}

function gearSetCanDualDye(setItem) {
  const pieces = getListSetPieceItems(setItem);

  return representativePiecesHaveAny(pieces, "canDualDye");
}

function gearSetCanDresserSet(setItem) {
  const pieces = getListSetPieceItems(setItem);

  return representativePiecesHaveAny(pieces, "canDresserSet");
}

function gearSetCanSellOnMarket(setItem) {
  const pieces = getListSetPieceItems(setItem);

  return pieces.some(piece => piece.canSellOnMarket);
}

function gearSetHasModelLinks(setItem) {
  return getSimilarGearSetItems(setItem).length > 0;
}

function gearSetMatchesStatusFilters(setItem) {
  if (!setLikeMatchesDyeFilters(setItem)) {
    return false;
  }

  if (armoireOnly.checked && !gearSetCanArmoire(setItem)) {
    return false;
  }

  if (marketOnly.checked && !gearSetCanSellOnMarket(setItem)) {
    return false;
  }

  if (gearSetDresserSetOnly.checked && !gearSetCanDresserSet(setItem)) {
    return false;
  }

  if (gearSetLooseOnly.checked && gearSetCanDresserSet(setItem)) {
    return false;
  }

  if (gearSetArmoireOnly.checked && !gearSetCanArmoire(setItem)) {
    return false;
  }

  if (gearSetNotArmoireOnly.checked && gearSetCanArmoire(setItem)) {
    return false;
  }

  if (gearSetHasModelLinksOnly.checked && !gearSetHasModelLinks(setItem)) {
    return false;
  }

  if (gearSetNoModelLinksOnly.checked && gearSetHasModelLinks(setItem)) {
    return false;
  }

  return true;
}

function renderGearSetList() {
  const keyword = searchInput.value.trim();
  const minItemLevel = minItemLevelInput.value === ""
    ? 0
    : Number(minItemLevelInput.value);
  const maxItemLevel = maxItemLevelInput.value === ""
    ? Infinity
    : Number(maxItemLevelInput.value);
  const minEquipLevel = minEquipLevelInput.value === ""
    ? 0
    : Number(minEquipLevelInput.value);
  const maxEquipLevel = maxEquipLevelInput.value === ""
    ? Infinity
    : Number(maxEquipLevelInput.value);
  const officialSets = mirageSets
    .map(setItem => makeListSetItem(setItem, "gearSets"))
    .filter(setItem => getListSetPieceItems(setItem).length > 0);
  const customSets = customGearSets
    .map(setItem => makeListSetItem(setItem, "customGearSets"))
    .filter(setItem => getListSetPieceItems(setItem).length > 0);

  let sets = [...officialSets, ...customSets]
    .filter(setItem => {
      const pieces = getListSetPieceItems(setItem);
      const keywordText = [
        setItem.name,
        setItem.id,
        ...pieces.map(piece => piece.name || "")
      ].join(" ");
      const itemLevel = getGearSetMaxNumber(setItem, "itemLevel");
      const equipLevel = getGearSetMaxNumber(setItem, "equipLevel");
      const matchKeyword = !keyword || keywordText.includes(keyword);
      const matchItemLevel = itemLevel >= minItemLevel && itemLevel <= maxItemLevel;
      const matchEquipLevel = equipLevel >= minEquipLevel && equipLevel <= maxEquipLevel;

      return (
        matchKeyword &&
        matchItemLevel &&
        matchEquipLevel &&
        gearSetMatchesCategoryFilter(setItem) &&
        gearSetMatchesSourceFilters(setItem) &&
        gearSetMatchesStatusFilters(setItem)
      );
    });

  if (recommendedGearOnly.checked) {
    sets = sets.filter(setItem => {
      return gearSetRecommendedKeys.has(getGearSetListItemKey(setItem));
    });
  }

  sets = sets.sort((a, b) => {
      if (sortFilter.value === "itemLevelDesc") {
        return getGearSetMaxNumber(b, "itemLevel") - getGearSetMaxNumber(a, "itemLevel");
      }

      if (sortFilter.value === "equipLevelDesc") {
        return getGearSetMaxNumber(b, "equipLevel") - getGearSetMaxNumber(a, "equipLevel");
      }

      if (sortFilter.value === "armoireFirst") {
        return Number(gearSetCanArmoire(b)) - Number(gearSetCanArmoire(a));
      }

      return String(a.name).localeCompare(String(b.name), "zh-Hans-CN");
    });

  const focusWindow = getFocusedListWindow(
    sets,
    "gearSets",
    setItem => makeEntityKey(setItem.engine, setItem.id)
  );
  const fallbackEntity = focusWindow && !focusWindow.targetFound
    ? getFocusedFallbackEntity()
    : null;
  const fallbackSet = fallbackEntity && (fallbackEntity.engine === "gearSets" || fallbackEntity.engine === "customGearSets")
    ? {
      engine: fallbackEntity.engine,
      id: fallbackEntity.id,
      name: fallbackEntity.engine === "gearSets"
        ? fallbackEntity.data.setName || `套装 ${fallbackEntity.data.setId}`
        : fallbackEntity.data.name || fallbackEntity.data.id,
      pieceCount: fallbackEntity.engine === "gearSets"
        ? (fallbackEntity.data.pieces || []).length
        : (fallbackEntity.data.pieceIds || []).length,
      data: fallbackEntity.data
    }
    : null;
  const visibleSets = focusWindow
    ? (focusWindow.targetFound ? focusWindow.items : (fallbackSet ? [fallbackSet] : []))
    : sets.slice(0, visibleResultCount);

  resultList.innerHTML = renderFocusedListNotice(focusWindow);
  resultCount.textContent = sets.length;
  activeFilters.textContent = [
    `当前筛选：${getEngineLabel(currentEngine)}`,
    keyword ? `关键词：${keyword}` : "",
    equipSlotFilter.value !== "all" ? equipSlotFilter.options[equipSlotFilter.selectedIndex].text : "",
    gearSetSourceCategoryFilter.value !== "all" ? gearSetSourceCategoryFilter.options[gearSetSourceCategoryFilter.selectedIndex].text : "",
    gearSetSourceSubcategoryFilter.value !== "all" ? gearSetSourceSubcategoryFilter.options[gearSetSourceSubcategoryFilter.selectedIndex].text : "",
    gearSetSourceDetailFilter.value !== "all" ? gearSetSourceDetailFilter.options[gearSetSourceDetailFilter.selectedIndex].text : "",
    ...getSelectedDyeLabels(),
    armoireOnly.checked ? "只看可进收藏柜" : "",
    gearSetDresserSetOnly.checked ? "可成套加入投影台" : "",
    gearSetLooseOnly.checked ? "尚未收录成套" : "",
    gearSetArmoireOnly.checked ? "可加入收藏柜" : "",
    gearSetNotArmoireOnly.checked ? "不可加入收藏柜" : "",
    gearSetHasModelLinksOnly.checked ? "有相似套装" : "",
    gearSetNoModelLinksOnly.checked ? "无相似套装" : "",
    recommendedGearOnly.checked ? "推荐套装" : ""
  ].filter(Boolean).join(" / ");

  if (sets.length === 0 && !fallbackSet) {
    resultList.innerHTML = `
      <div class="empty-result">
        <p>没有找到符合条件的套装。</p>
        <p class="empty-result-tip">可以尝试清空关键词。</p>
      </div>
    `;
    loadMoreButton.classList.add("hidden");
    return;
  }

  if (focusWindow) {
    loadMoreButton.classList.add("hidden");
  } else if (visibleResultCount < sets.length) {
    loadMoreButton.classList.remove("hidden");
    loadMoreButton.textContent = `加载更多（已显示 ${visibleSets.length} / 共 ${sets.length} 条）`;
  } else {
    loadMoreButton.classList.add("hidden");
  }

  visibleSets.forEach(setItem => {
    const div = document.createElement("div");
    const isSelectedSet =
      selectedSetRoute &&
      selectedSetRoute.engine === setItem.engine &&
      String(selectedSetRoute.id) === String(setItem.id);

    div.className = isSelectedSet ? "item-card selected-card" : "item-card";
    div.dataset.engine = setItem.engine;
    div.dataset.id = String(setItem.id);

    const icon = setItem.engine === "gearSets"
      ? getOfficialGearSetIcon(setItem.id)
      : getCustomGearSetIcon(setItem.data);

    div.innerHTML = `
      ${icon ? `<img class="item-icon" src="${icon}" alt="${setItem.name}">` : ""}
      ${renderWishlistScopeButtons(setItem.engine, setItem.id)}
      <div class="item-info">
        <strong>${setItem.name}</strong><br>
        类型：${setItem.engine === "gearSets" ? "官方套装" : "自定义套装"}<br>
        包含部位：${renderPieceSlotInitials(getListSetPieceItems(setItem))}
        ${renderGearSetListStatusTags(setItem)}
      </div>
    `;

    div.addEventListener("click", async (event) => {
      if (event.target.closest(".wishlist-toggle-button")) {
        return;
      }

      const detailVersion = startDetailLoad();
      selectedSetRoute = {
        engine: setItem.engine,
        id: setItem.id
      };
      selectedItemId = null;
      selectedSeriesId = null;
      selectedWeaponId = null;
      isSameModelExpanded = false;
      isSameModelGalleryExpanded = false;
      updateSelectedSetCardHighlight();

      if (setItem.engine === "gearSets") {
        try {
          if (!fullGearDataLoaded) {
            renderDetailLoading("正在加载套装完整详情。");
            await loadFullGearData();

            if (!isCurrentDetailLoad(detailVersion)) {
              return;
            }
          }

          if (!isCurrentDetailLoad(detailVersion)) {
            return;
          }

          renderOfficialGearSetDetail(setItem.data);
        } catch (error) {
          if (isCurrentDetailLoad(detailVersion)) {
            renderDetailLoadError(error);
          }
        }
      } else {
        try {
          if (!fullGearDataLoaded) {
            renderDetailLoading("正在加载自定义套装完整详情。");
            await loadFullGearData();

            if (!isCurrentDetailLoad(detailVersion)) {
              return;
            }
          }

          if (!isCurrentDetailLoad(detailVersion)) {
            return;
          }

          renderCustomGearSetDetail(setItem.data);
        } catch (error) {
          if (isCurrentDetailLoad(detailVersion)) {
            renderDetailLoadError(error);
          }
        }
      }

      updateCurrentEngineStatePatch({
        filterState: getFilterStateFromControls(),
        visibleResultCount,
        selectedItemId,
        selectedSetRoute: { ...selectedSetRoute },
        selectedSeriesId,
        selectedWeaponId,
        detailHtml: getDetailHtmlForState(),
        isSameModelExpanded
      });
    });

    resultList.appendChild(div);
  });

  scrollSelectedSetIntoView();
}

function getGearSeriesSetItems(seriesItem) {
  return (seriesItem.gameSetIds || [])
    .map(setId => {
      return getEntityData({
        engine: "gearSets",
        id: setId
      });
    })
    .filter(Boolean);
}

function getGearSeriesListSetItems(seriesItem) {
  const officialSets = (seriesItem.gameSetIds || [])
    .map(setId => {
      const setData = getEntityData({
        engine: "gearSets",
        id: setId
      });

      if (!setData) {
        return null;
      }

      return {
        engine: "gearSets",
        id: setData.setId,
        name: setData.setName || `套装 ${setData.setId}`,
        pieceCount: (setData.pieces || []).length,
        data: setData
      };
    })
    .filter(Boolean);

  const customSets = (seriesItem.customSetIds || [])
    .map(setId => {
      const setData = getEntityData({
        engine: "customGearSets",
        id: setId
      });

      if (!setData) {
        return null;
      }

      return {
        engine: "customGearSets",
        id: setData.id,
        name: setData.name || setData.id,
        pieceCount: (setData.pieceIds || []).length,
        data: setData
      };
    })
    .filter(Boolean);

  return [...officialSets, ...customSets];
}

function getGearSeriesSourceText(seriesItem) {
  const setSourceText = getGearSeriesListSetItems(seriesItem)
    .map(setItem => getGearSetSourceText(setItem))
    .filter(Boolean)
    .join(" ");

  return [
    seriesItem.sourceCategory || "",
    seriesItem.sourceSubCategory || "",
    seriesItem.sourceSubcategory || "",
    seriesItem.sourceSummary || "",
    seriesItem.source || "",
    seriesItem.name || "",
    seriesItem.note || "",
    ...(seriesItem.keywords || []),
    setSourceText
  ].filter(Boolean).join(" ");
}

function getGearSeriesSourceCategory(seriesItem) {
  return seriesItem.sourceFilterCategory || "uncategorized";
}

function getGearSeriesSourceCategories(seriesItem) {
  const categories = [
    ...(Array.isArray(seriesItem.sourceFilterCategories) ? seriesItem.sourceFilterCategories : []),
    seriesItem.sourceFilterCategory || ""
  ];
  const uniqueCategories = Array.from(new Set(categories.filter(Boolean)));

  if (uniqueCategories.length > 0) {
    return uniqueCategories;
  }

  return [getGearSeriesSourceCategory(seriesItem)].filter(Boolean);
}

function getGearSeriesSourceSubCategories(seriesItem) {
  const subcategories = [
    seriesItem.sourceFilterGroup || seriesItem.sourceFilterSubCategory || "",
    seriesItem.sourceFilterGroupId || "",
    ...(Array.isArray(seriesItem.sourceFilterGroups) ? seriesItem.sourceFilterGroups : [])
  ];

  return Array.from(new Set(subcategories.filter(Boolean)));
}

function getGearSeriesSourceDetails(seriesItem) {
  const details = [
    seriesItem.sourceFilterSubCategory || "",
    seriesItem.sourceFilterSubcategory || "",
    ...(Array.isArray(seriesItem.sourceFilterSubCategories) ? seriesItem.sourceFilterSubCategories : [])
  ];

  return Array.from(new Set(details.filter(Boolean)));
}

function gearSeriesMatchesSourceFilters(seriesItem) {
  const selectedCategory = gearSetSourceCategoryFilter.value;
  const selectedSubcategory = gearSetSourceSubcategoryFilter.value;
  const selectedDetail = gearSetSourceDetailFilter.value;
  const categories = getGearSeriesSourceCategories(seriesItem);

  if (selectedCategory !== "all" && !categories.includes(selectedCategory)) {
    return false;
  }

  if (selectedSubcategory !== "all") {
    const subcategories = getGearSeriesSourceSubCategories(seriesItem);
    if (!subcategories.includes(selectedSubcategory)) {
      return false;
    }
  }

  if (selectedDetail !== "all") {
    const details = getGearSeriesSourceDetails(seriesItem);
    if (!details.includes(selectedDetail)) {
      return false;
    }
  }

  return true;
}

function getGearSeriesPieceItems(seriesItem) {
  return getGearSeriesListSetItems(seriesItem)
    .flatMap(setItem => getListSetPieceItems(setItem));
}

function gearSeriesCanDye(seriesItem) {
  const pieces = getGearSeriesPieceItems(seriesItem);

  return representativePiecesHaveAny(pieces, "canDye");
}

function gearSeriesCanSingleDyeOnly(seriesItem) {
  const pieces = getGearSeriesPieceItems(seriesItem);

  return representativePiecesCanSingleDyeOnly(pieces);
}

function gearSeriesCanDualDye(seriesItem) {
  const pieces = getGearSeriesPieceItems(seriesItem);

  return representativePiecesHaveAny(pieces, "canDualDye");
}

function gearSeriesCanArmoire(seriesItem) {
  const pieces = getGearSeriesPieceItems(seriesItem);

  return representativePiecesHaveAny(pieces, "canArmoire");
}

function gearSeriesCanDresserSet(seriesItem) {
  const pieces = getGearSeriesPieceItems(seriesItem);

  return representativePiecesHaveAny(pieces, "canDresserSet");
}

function gearSeriesCanSellOnMarket(seriesItem) {
  const pieces = getGearSeriesPieceItems(seriesItem);

  return pieces.some(piece => piece.canSellOnMarket);
}

function gearSeriesHasModelLinks(seriesItem) {
  return getGearSeriesListSetItems(seriesItem).some(setItem => {
    return gearSetHasModelLinks(setItem);
  });
}

function gearSeriesMatchesStatusFilters(seriesItem) {
  if (!seriesMatchesDyeFilters(seriesItem)) {
    return false;
  }

  if (armoireOnly.checked && !gearSeriesCanArmoire(seriesItem)) {
    return false;
  }

  if (marketOnly.checked && !gearSeriesCanSellOnMarket(seriesItem)) {
    return false;
  }

  if (gearSetDresserSetOnly.checked && !gearSeriesCanDresserSet(seriesItem)) {
    return false;
  }

  if (gearSetLooseOnly.checked && gearSeriesCanDresserSet(seriesItem)) {
    return false;
  }

  if (gearSetArmoireOnly.checked && !gearSeriesCanArmoire(seriesItem)) {
    return false;
  }

  if (gearSetNotArmoireOnly.checked && gearSeriesCanArmoire(seriesItem)) {
    return false;
  }

  if (gearSetHasModelLinksOnly.checked && !gearSeriesHasModelLinks(seriesItem)) {
    return false;
  }

  if (gearSetNoModelLinksOnly.checked && gearSeriesHasModelLinks(seriesItem)) {
    return false;
  }

  return true;
}

function getGearPieceSourceText(item) {
  if (item.sourceSearchText) {
    return item.sourceSearchText;
  }

  const sourceParts = getDisplaySources(item).map(source => {
    return [
      source.category || "",
      source.subCategory || "",
      source.routeType || "",
      source.method || "",
      source.type || "",
      source.subType || "",
      source.name || "",
      source.content || "",
      source.contentName || "",
      source.contentLevel || "",
      source.detail || "",
      source.recipeBook || "",
      source.recipeBookItemId || "",
      source.npcName || "",
      source.location || "",
      source.currency || "",
      source.price || "",
      source.containerItem?.name || "",
      source.requiredItem?.name || "",
      ...(source.costItems || []).map(cost => [cost.name || "", cost.amount || ""].filter(Boolean).join(" ")),
      source.note || ""
    ].filter(Boolean).join(" ");
  });

  return [
    item.sourceCategory || "",
    ...(Array.isArray(item.sourceCategories) ? item.sourceCategories : []),
    item.sourceSubCategory || "",
    item.sourceSubcategory || "",
    ...(Array.isArray(item.sourceSubCategories) ? item.sourceSubCategories : []),
    item.sourceSummary || "",
    item.source || "",
    item.name || "",
    ...sourceParts
  ].filter(Boolean).join(" ");
}

function getGearPieceSourceCategories(item) {
  const categories = [];

  if (Array.isArray(item.sourceFilterCategories)) {
    categories.push(...item.sourceFilterCategories);
  }

  if (item.sourceFilterCategory) {
    categories.push(item.sourceFilterCategory);
  }

  const uniqueCategories = Array.from(new Set(categories.filter(Boolean)));

  if (uniqueCategories.length > 0) {
    return uniqueCategories;
  }

  return [getGearPieceSourceCategory(item)].filter(Boolean);
}

function getGearPieceSourceCategory(item) {
  return item.sourceFilterCategory || "uncategorized";
}

function getGearPieceSourceSubCategories(item) {
  const subcategories = [];

  if (item.sourceFilterGroup || item.sourceFilterSubCategory) {
    subcategories.push(item.sourceFilterGroup || item.sourceFilterSubCategory);
  }

  if (item.sourceFilterGroupId) {
    subcategories.push(item.sourceFilterGroupId);
  }

  if (Array.isArray(item.sourceFilterGroups)) {
    subcategories.push(...item.sourceFilterGroups);
  }

  return Array.from(new Set(subcategories.filter(Boolean)));
}

function getGearPieceSourceDetails(item) {
  const details = [];

  if (item.sourceFilterSubCategory) {
    details.push(item.sourceFilterSubCategory);
  }

  if (item.sourceFilterSubcategory) {
    details.push(item.sourceFilterSubcategory);
  }

  if (Array.isArray(item.sourceFilterSubCategories)) {
    details.push(...item.sourceFilterSubCategories);
  }

  return Array.from(new Set(details.filter(Boolean)));
}

function gearPieceMatchesSourceFilters(item) {
  const selectedCategory = gearSetSourceCategoryFilter.value;
  const selectedSubcategory = gearSetSourceSubcategoryFilter.value;
  const selectedDetail = gearSetSourceDetailFilter.value;
  const categories = getGearPieceSourceCategories(item);
  const subcategories = getGearPieceSourceSubCategories(item);
  const details = getGearPieceSourceDetails(item);

  if (selectedCategory !== "all" && !categories.includes(selectedCategory)) {
    return false;
  }

  if (selectedSubcategory !== "all" && !subcategories.includes(selectedSubcategory)) {
    return false;
  }

  if (selectedDetail !== "all" && !details.includes(selectedDetail)) {
    return false;
  }

  return true;
}

function itemMatchesSourceCategoryFilters(item) {
  return gearPieceMatchesSourceFilters(item);
}

function gearPieceHasSameModel(item) {
  if (item.hasSameModel !== undefined) {
    return Boolean(item.hasSameModel);
  }

  const currentModelCompareKey = getModelCompareKey(item);

  if (!currentModelCompareKey) {
    return false;
  }

  const indexKey = getGearSameModelIndexKey(item);
  return (gearItemsByModelKey[indexKey] || []).some(other => other.id !== item.id);
}

function getSelectedDyeModes() {
  const modes = [];

  if (noDyeOnly.checked) {
    modes.push("none");
  }

  if (dyeOnly.checked) {
    modes.push("single");
  }

  if (dualDyeOnly.checked) {
    modes.push("dual");
  }

  return modes.length === 0 || modes.length === 3 ? [] : modes;
}

function getSelectedDyeLabels() {
  const labelMap = {
    none: "不可染",
    single: "单染",
    dual: "可双染"
  };

  return getSelectedDyeModes().map(mode => labelMap[mode]).filter(Boolean);
}

function itemMatchesDyeFilters(item) {
  const modes = getSelectedDyeModes();

  if (modes.length === 0) {
    return true;
  }

  return modes.some(mode => {
    if (mode === "none") {
      return !item.canDye && !item.canDualDye;
    }

    if (mode === "single") {
      return item.canDye && !item.canDualDye;
    }

    if (mode === "dual") {
      return item.canDualDye;
    }

    return false;
  });
}

function setLikeMatchesDyeFilters(entity) {
  const modes = getSelectedDyeModes();

  if (modes.length === 0) {
    return true;
  }

  return modes.some(mode => {
    if (mode === "none") {
      return !gearSetCanSingleDyeOnly(entity) && !gearSetCanDualDye(entity);
    }

    if (mode === "single") {
      return gearSetCanSingleDyeOnly(entity);
    }

    if (mode === "dual") {
      return gearSetCanDualDye(entity);
    }

    return false;
  });
}

function seriesMatchesDyeFilters(seriesItem) {
  const modes = getSelectedDyeModes();

  if (modes.length === 0) {
    return true;
  }

  return modes.some(mode => {
    if (mode === "none") {
      return !gearSeriesCanSingleDyeOnly(seriesItem) && !gearSeriesCanDualDye(seriesItem);
    }

    if (mode === "single") {
      return gearSeriesCanSingleDyeOnly(seriesItem);
    }

    if (mode === "dual") {
      return gearSeriesCanDualDye(seriesItem);
    }

    return false;
  });
}

function gearPieceMatchesCollectionFilters(item) {
  if (!itemMatchesDyeFilters(item)) {
    return false;
  }

  if (gearSetDresserSetOnly.checked && !item.canDresserSet) {
    return false;
  }

  if (gearSetLooseOnly.checked && item.canDresserSet) {
    return false;
  }

  if (gearSetArmoireOnly.checked && !item.canArmoire) {
    return false;
  }

  if (gearSetNotArmoireOnly.checked && item.canArmoire) {
    return false;
  }

  if (gearSetHasModelLinksOnly.checked && !gearPieceHasSameModel(item)) {
    return false;
  }

  if (gearSetNoModelLinksOnly.checked && gearPieceHasSameModel(item)) {
    return false;
  }

  return true;
}

function getGearSeriesIcon(seriesItem) {
  const firstGameSetId = (seriesItem.gameSetIds || [])[0];

  if (firstGameSetId) {
    return getOfficialGearSetIcon(firstGameSetId);
  }

  const firstCustomSetId = (seriesItem.customSetIds || [])[0];

  if (firstCustomSetId) {
    const customSet = getEntityData({
      engine: "customGearSets",
      id: firstCustomSetId
    });

    return getCustomGearSetIcon(customSet);
  }

  return "";
}

function renderGearSeriesDetail(seriesItem) {
  selectedSeriesId = seriesItem.id;

  const setItems = getGearSeriesListSetItems(seriesItem);
  const pieces = getGearSeriesPieceItems(seriesItem);

  const setCards = setItems.map(setItem => {
    return renderSetPreviewCard(setItem);
  }).join("");
  const seriesPreviewCards = renderGearSeriesColorPreviewCards(seriesItem);

  const seriesKindText = seriesItem.seriesKind === "official"
    ? "官方系列"
    : (seriesItem.seriesKind === "manual" ? "手动系列" : "未标记");

  detailBox.innerHTML = `
    ${renderSetOrSeriesInfoCard({
      icon: getGearSeriesIcon(seriesItem),
      name: seriesItem.name,
      typeLabel: seriesKindText,
      pieces,
      canDresserSet: gearSeriesCanDresserSet(seriesItem),
      canArmoire: gearSeriesCanArmoire(seriesItem),
      note: seriesItem.sourceSummary || seriesItem.source || seriesItem.sourceCategory || "",
      showSlots: false,
      wishlistEngine: "gearSeries",
      wishlistId: String(seriesItem.id)
    })}

    <div class="same-set-box">
      <h4>系列效果预览</h4>
      <div class="detail-preview-card-grid">
        ${seriesPreviewCards || "<p class=\"empty-result-tip\">暂无系列预览图</p>"}
      </div>
    </div>

    <div class="same-set-box">
      <h4>包含套装</h4>
      <div class="detail-preview-card-grid">
        ${setCards || "<p class=\"empty-result-tip\">暂无套装</p>"}
      </div>
    </div>

    ${seriesItem.note ? `
      <div class="source-box">
        <div class="source-title">备注</div>
        <div class="source-simple">${seriesItem.note}</div>
      </div>
    ` : ""}
  `;
}

function renderGearSeriesList() {
  const keyword = searchInput.value.trim();
  const minItemLevel = minItemLevelInput.value === ""
    ? 0
    : Number(minItemLevelInput.value);
  const maxItemLevel = maxItemLevelInput.value === ""
    ? Infinity
    : Number(maxItemLevelInput.value);
  const minEquipLevel = minEquipLevelInput.value === ""
    ? 0
    : Number(minEquipLevelInput.value);
  const maxEquipLevel = maxEquipLevelInput.value === ""
    ? Infinity
    : Number(maxEquipLevelInput.value);
  const filteredSeries = gearSeries
    .filter(seriesItem => {
      const minSeriesItemLevel = Number(seriesItem.minItemLevel || 0);
      const maxSeriesItemLevel = Number(seriesItem.maxItemLevel || seriesItem.minItemLevel || 0);
      const minSeriesEquipLevel = Number(seriesItem.minEquipLevel || 0);
      const maxSeriesEquipLevel = Number(seriesItem.maxEquipLevel || seriesItem.minEquipLevel || 0);
      const keywordText = [
        seriesItem.name,
        seriesItem.id,
        ...(seriesItem.keywords || []),
        ...getGearSeriesListSetItems(seriesItem).map(setItem => setItem.name)
      ].join(" ");
      const matchKeyword = !keyword || keywordText.includes(keyword);
      const matchItemLevel = maxSeriesItemLevel >= minItemLevel && minSeriesItemLevel <= maxItemLevel;
      const matchEquipLevel = maxSeriesEquipLevel >= minEquipLevel && minSeriesEquipLevel <= maxEquipLevel;

      return (
        matchKeyword &&
        matchItemLevel &&
        matchEquipLevel &&
        gearSeriesMatchesSourceFilters(seriesItem) &&
        gearSeriesMatchesStatusFilters(seriesItem)
      );
    })
    .sort((a, b) => {
      if (sortFilter.value === "itemLevelDesc") {
        return Number(b.maxItemLevel || 0) - Number(a.maxItemLevel || 0);
      }

      if (sortFilter.value === "equipLevelDesc") {
        return Number(b.maxEquipLevel || 0) - Number(a.maxEquipLevel || 0);
      }

      if (sortFilter.value === "armoireFirst") {
        return Number(gearSeriesCanArmoire(b)) - Number(gearSeriesCanArmoire(a));
      }

      if (sortFilter.value === "dualDyeFirst") {
        return Number(gearSeriesCanDualDye(b)) - Number(gearSeriesCanDualDye(a));
      }

      return String(a.name).localeCompare(String(b.name), "zh-Hans-CN");
    });

  const focusWindow = getFocusedListWindow(
    filteredSeries,
    "gearSeries",
    seriesItem => seriesItem.id
  );
  const fallbackEntity = focusWindow && !focusWindow.targetFound
    ? getFocusedFallbackEntity()
    : null;
  const fallbackSeries = fallbackEntity && fallbackEntity.engine === "gearSeries"
    ? fallbackEntity.data
    : null;
  const visibleSeries = focusWindow
    ? (focusWindow.targetFound ? focusWindow.items : (fallbackSeries ? [fallbackSeries] : []))
    : filteredSeries.slice(0, visibleResultCount);

  resultList.innerHTML = renderFocusedListNotice(focusWindow);
  resultCount.textContent = filteredSeries.length;
  activeFilters.textContent = [
    `当前筛选：${getEngineLabel(currentEngine)}`,
    keyword ? `关键词：${keyword}` : "",
    gearSetSourceCategoryFilter.value !== "all" ? gearSetSourceCategoryFilter.options[gearSetSourceCategoryFilter.selectedIndex].text : "",
    gearSetSourceSubcategoryFilter.value !== "all" ? gearSetSourceSubcategoryFilter.options[gearSetSourceSubcategoryFilter.selectedIndex].text : "",
    gearSetSourceDetailFilter.value !== "all" ? gearSetSourceDetailFilter.options[gearSetSourceDetailFilter.selectedIndex].text : "",
    ...getSelectedDyeLabels(),
    armoireOnly.checked ? "只看可进收藏柜" : "",
    gearSetDresserSetOnly.checked ? "可成套加入投影台" : "",
    gearSetLooseOnly.checked ? "尚未收录成套" : "",
    gearSetArmoireOnly.checked ? "可加入收藏柜" : "",
    gearSetNotArmoireOnly.checked ? "不可加入收藏柜" : "",
    gearSetHasModelLinksOnly.checked ? "有相似套装" : "",
    gearSetNoModelLinksOnly.checked ? "无相似套装" : ""
  ].filter(Boolean).join(" / ");
  if (filteredSeries.length === 0 && !fallbackSeries) {
    resultList.innerHTML = `
      <div class="empty-result">
        <p>没有找到符合条件的装备系列。</p>
        <p class="empty-result-tip">可以尝试清空关键词，或之后在 manual-gear-series.csv 里继续维护。</p>
      </div>
    `;
    loadMoreButton.classList.add("hidden");
    return;
  }

  if (focusWindow) {
    loadMoreButton.classList.add("hidden");
  } else if (visibleResultCount < filteredSeries.length) {
    loadMoreButton.classList.remove("hidden");
    loadMoreButton.textContent = `加载更多（已显示 ${visibleSeries.length} / 共 ${filteredSeries.length} 条）`;
  } else {
    loadMoreButton.classList.add("hidden");
  }

  visibleSeries.forEach(seriesItem => {
    const div = document.createElement("div");
    div.className = String(seriesItem.id) === String(selectedSeriesId)
      ? "item-card selected-card"
      : "item-card";
    div.dataset.engine = "gearSeries";
    div.dataset.id = String(seriesItem.id);

    const icon = getGearSeriesIcon(seriesItem);

    div.innerHTML = `
      ${icon ? `<img class="item-icon" src="${icon}" alt="${seriesItem.name}">` : ""}
      ${renderWishlistScopeButtons("gearSeries", seriesItem.id)}
      <div class="item-info">
        <strong>${seriesItem.name}</strong><br>
        类型：装备系列
        ${renderGearSeriesListStatusTags(seriesItem)}
      </div>
    `;

    div.addEventListener("click", async (event) => {
      if (event.target.closest(".wishlist-toggle-button")) {
        return;
      }

      const detailVersion = startDetailLoad();
      try {
        if (!fullGearDataLoaded) {
          renderDetailLoading("正在加载系列完整详情。");
          await loadFullGearData();

          if (!isCurrentDetailLoad(detailVersion)) {
            return;
          }
        }

        if (!isCurrentDetailLoad(detailVersion)) {
          return;
        }

        renderGearSeriesDetail(seriesItem);
        updateSelectedSeriesCardHighlight();
      } catch (error) {
        if (isCurrentDetailLoad(detailVersion)) {
          renderDetailLoadError(error);
        }
      }

      updateCurrentEngineStatePatch({
        filterState: getFilterStateFromControls(),
        visibleResultCount,
        selectedItemId,
        selectedSetRoute,
        selectedSeriesId,
        selectedWeaponId,
        detailHtml: getDetailHtmlForState(),
        isSameModelExpanded
      });
    });

    resultList.appendChild(div);
  });

  scrollSelectedSeriesIntoView();
}

function scrollSelectedSeriesIntoView() {
  if (skipSelectedScrollOnce) {
    skipSelectedScrollOnce = false;
    return;
  }

  if (!selectedSeriesId || currentEngine !== "gearSeries") {
    return;
  }

  const selector = `[data-engine="gearSeries"][data-id="${String(selectedSeriesId)}"]`;
  const selectedCard = resultList.querySelector(selector);

  if (!selectedCard) {
    return;
  }

  selectedCard.scrollIntoView({
    block: "center",
    behavior: "smooth"
  });
}

function getWishlistSourceGroup(resolvedItem) {
  const text = getWishlistSourceSummary(resolvedItem);

  if (!text || text === "获取方式未记录") {
    return "获取方式未记录";
  }

  if (text.includes("商城")) return "商城";
  if (text.includes("制作") || text.includes("配方")) return "制作";
  if (text.includes("NPC购买") || text.includes("金币购买")) return "NPC购买";
  if (/神典石|货币|兑换|军票|金碟|狼印|双色宝石|工票/.test(text)) return "点数/货币兑换";
  if (/副本|讨伐|歼灭|团队任务|大型任务|零式/.test(text)) return "战斗内容";
  if (/PVP|狼印/.test(text)) return "PVP";
  if (/任务|成就/.test(text)) return "任务/成就";
  if (/季节活动|活动|联动/.test(text)) return "活动";

  return "其他";
}

function getWishlistSourceSummary(resolvedItem) {
  if (!resolvedItem || !resolvedItem.entity) {
    return "获取方式未记录";
  }

  const entity = resolvedItem.entity;
  const data = entity.data || {};

  if (entity.engine === "gearPieces" || entity.engine === "weaponPieces") {
    return getSourceText(data);
  }

  if (entity.engine === "gearSets") {
    return data.sourceSummary || data.source || data.sourceCategory || "获取方式未记录";
  }

  if (entity.engine === "customGearSets") {
    return data.sourceSummary || data.source || "获取方式未记录";
  }

  if (entity.engine === "gearSeries") {
    return data.sourceSummary || data.source || data.sourceCategory || data.note || "获取方式未记录";
  }

  if (entity.engine === "weaponSeries") {
    return data.sourceSummary || data.source || data.note || "获取方式未记录";
  }

  return "获取方式未记录";
}

function getWishlistDisplayName(resolvedItem) {
  if (!resolvedItem || !resolvedItem.entity) {
    return "数据已失效";
  }

  const entity = resolvedItem.entity;

  if (entity.engine === "gearPieces" || entity.engine === "weaponPieces") {
    return entity.data.name || entity.id;
  }

  if (entity.engine === "gearSets") {
    return entity.data.setName || `套装 ${entity.data.setId}`;
  }

  if (entity.engine === "customGearSets") {
    return entity.data.name || entity.data.id;
  }

  if (entity.engine === "gearSeries" || entity.engine === "weaponSeries") {
    return entity.data.name || entity.id;
  }

  return entity.id || "未知";
}

function getWishlistIcon(resolvedItem) {
  if (!resolvedItem || !resolvedItem.entity) {
    return "";
  }

  const entity = resolvedItem.entity;

  if (entity.engine === "gearPieces") {
    return entity.data.icon || "";
  }

  if (entity.engine === "weaponPieces") {
    return entity.data.icon || "";
  }

  if (entity.engine === "gearSets") {
    return getOfficialGearSetIcon(entity.id) || "";
  }

  if (entity.engine === "customGearSets") {
    return getCustomGearSetIcon(entity.data) || "";
  }

  if (entity.engine === "gearSeries") {
    return getGearSeriesIcon(entity.data) || "";
  }

  if (entity.engine === "weaponSeries") {
    return entity.data.icon || "";
  }

  return "";
}

function getWishlistTypeLabel(resolvedItem) {
  if (!resolvedItem || !resolvedItem.engine) {
    return "未知";
  }

  const labels = {
    gearPieces: "装备散件",
    gearSets: "官方套装",
    customGearSets: "自定义套装",
    gearSeries: "装备系列",
    weaponPieces: "武器散件",
    weaponSeries: "武器系列"
  };

  return labels[resolvedItem.engine] || resolvedItem.engine;
}

function getWishlistCompactMeta(resolvedItem) {
  if (!resolvedItem || !resolvedItem.entity) {
    return "数据已失效";
  }

  const item = resolvedItem.entity.data || {};
  const parts = [];

  if (item.equipLevel !== undefined && item.equipLevel !== null && item.equipLevel !== "") {
    parts.push(`Lv${item.equipLevel}`);
  }

  if (item.equipSlot) {
    parts.push(item.equipSlot);
  } else if (item.weaponSlot || item.weaponType) {
    parts.push([item.weaponSlot, item.weaponType].filter(Boolean).join(" "));
  } else {
    parts.push(getWishlistTypeLabel(resolvedItem));
  }

  if (item.itemLevel !== undefined && item.itemLevel !== null && item.itemLevel !== "") {
    parts.push(`品级 ${item.itemLevel}`);
  }

  return parts.filter(Boolean).join(" / ");
}

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
  "获取方式未记录"
];

const WISHLIST_STATUS_LABELS = {
  wanted: "想要",
  farming: "正在刷",
  acquired: "已获得"
};

function renderWishlistList() {
  let resolvedItems;
  updateWishlistHeaderActionPanel();

  try {
    resolvedItems = getResolvedWishlistItems();
  } catch (e) {
    console.error("愿望单数据加载失败：", e);
    resultCount.textContent = "0";
    activeFilters.textContent = "当前筛选：愿望单";
    loadMoreButton.classList.add("hidden");
    resultList.innerHTML = `
      <div class="empty-result">
        <p>愿望单数据读取失败。</p>
        <p class="empty-result-tip">请检查浏览器 localStorage 是否可用。</p>
      </div>
    `;
    return;
  }

  resultCount.textContent = resolvedItems.length;
  activeFilters.textContent = "当前筛选：愿望单";
  loadMoreButton.classList.add("hidden");

  if (resolvedItems.length === 0) {
    resultList.innerHTML = `
      <div class="empty-result">
        <p>愿望单是空的。</p>
        <p class="empty-result-tip">在装备/套装/系列/武器的详情页，点击"加入愿望单"即可添加。</p>
      </div>
    `;
    return;
  }

  try {
    const groups = new Map();

    for (const resolvedItem of resolvedItems) {
      const group = getWishlistSourceGroup(resolvedItem);

      if (!groups.has(group)) {
        groups.set(group, []);
      }

      groups.get(group).push(resolvedItem);
    }

    const orderedGroups = WISHLIST_SOURCE_GROUP_ORDER.filter(group => {
      return groups.has(group);
    });

    let html = "";

    for (const groupName of orderedGroups) {
      const items = groups.get(groupName);
      const groupHeader = `
        <div class="wishlist-group-header">
          <span>${groupName}</span>
          <span class="wishlist-group-count">${items.length} 条</span>
        </div>
      `;
      const itemCards = items.map(resolvedItem => {
        const icon = getWishlistIcon(resolvedItem);
        const name = getWishlistDisplayName(resolvedItem);
        const compactMeta = getWishlistCompactMeta(resolvedItem);
        const sourceSummary = getWishlistSourceSummary(resolvedItem);
        const statusLabel = WISHLIST_STATUS_LABELS[resolvedItem.status] || resolvedItem.status;
        const engine = resolvedItem.engine;
        const id = resolvedItem.id;

        return `
          <div class="wishlist-row">
            ${icon ? `<img class="wishlist-row-icon" src="${icon}" alt="${name}">` : `<div class="wishlist-row-icon wishlist-row-icon-missing"></div>`}
            <div class="wishlist-row-main">
              <button class="wishlist-row-name" data-wishlist-navigate="${engine}" data-wishlist-id="${String(id)}">
                ${name}
              </button>
              <div class="wishlist-row-meta">${compactMeta}</div>
              <div class="wishlist-row-source">${sourceSummary}</div>
            </div>
            <div class="wishlist-row-actions">
              <span class="wishlist-status wishlist-status-${resolvedItem.status}">${statusLabel}</span>
              <button data-wishlist-navigate="${engine}" data-wishlist-id="${String(id)}" title="跳转详情">
                详情
              </button>
              <button
                data-wishlist-acquired="${engine}"
                data-wishlist-id="${String(id)}"
                data-wishlist-status="${resolvedItem.status}"
                title="${resolvedItem.status === "acquired" ? "取消已获得" : "标记已获得"}"
              >
                ${resolvedItem.status === "acquired" ? "取消" : "完成"}
              </button>
              <button data-wishlist-remove="${engine}" data-wishlist-id="${String(id)}" title="移除">
                移除
              </button>
            </div>
          </div>
        `;
      }).join("");

      html += groupHeader + `<div class="wishlist-row-grid">${itemCards}</div>`;
    }

    resultList.innerHTML = html;
  } catch (e) {
    console.error("愿望单列表渲染失败：", e);
    resultCount.textContent = resolvedItems.length;
    activeFilters.textContent = "当前筛选：愿望单";
    loadMoreButton.classList.add("hidden");
    resultList.innerHTML = `
      <div class="empty-result">
        <p>愿望单列表渲染出错。</p>
        <p class="empty-result-tip">请打开浏览器控制台查看具体错误。</p>
        <p class="empty-result-tip">${e.message || String(e)}</p>
      </div>
    `;
  }
}

function renderWeaponList() {
  const keyword = searchInput.value.trim();
  const minItemLevel = minItemLevelInput.value === ""
    ? 0
    : Number(minItemLevelInput.value);
  const maxItemLevel = maxItemLevelInput.value === ""
    ? Infinity
    : Number(maxItemLevelInput.value);
  const minEquipLevel = minEquipLevelInput.value === ""
    ? 0
    : Number(minEquipLevelInput.value);
  const maxEquipLevel = maxEquipLevelInput.value === ""
    ? Infinity
    : Number(maxEquipLevelInput.value);
  const selectedWeaponType = weaponTypeFilter.value;
  const selectedMainHandOnly = mainHandOnly.checked;
  const selectedOffHandOnly = offHandOnly.checked;
  const selectedSourceCategory = gearSetSourceCategoryFilter.value;
  const selectedSourceSubcategory = gearSetSourceSubcategoryFilter.value;
  const selectedSourceDetail = gearSetSourceDetailFilter.value;

  const filteredWeapons = weaponItems.filter(weapon => {
    if (weapon.isBanned) {
      return false;
    }

    const matchKeyword =
      !keyword ||
      weapon.name.includes(keyword) ||
      String(weapon.weaponType || "").includes(keyword) ||
      String(weapon.weaponSlot || "").includes(keyword) ||
      renderWeaponJobs(weapon).includes(keyword);
    const matchItemLevel =
      weapon.itemLevel >= minItemLevel && weapon.itemLevel <= maxItemLevel;
    const matchEquipLevel =
      weapon.equipLevel >= minEquipLevel && weapon.equipLevel <= maxEquipLevel;
    const matchWeaponType =
      selectedWeaponType === "all" || weapon.weaponType === selectedWeaponType;
    const matchWeaponSlot =
      (!selectedMainHandOnly && !selectedOffHandOnly) ||
      (selectedMainHandOnly && weapon.weaponSlot === "主手") ||
      (selectedOffHandOnly && weapon.weaponSlot === "副手");
    const matchSource = itemMatchesSourceCategoryFilters(weapon);
  const matchMarket = !marketOnly.checked || weapon.canSellOnMarket;
    const matchDye = itemMatchesDyeFilters(weapon);

    return (
      matchKeyword &&
      matchItemLevel &&
      matchEquipLevel &&
      matchWeaponType &&
      matchWeaponSlot &&
      matchSource &&
      matchMarket &&
      matchDye
    );
  });

  const sortedWeapons = sortItems(filteredWeapons);

  const focusWindow = getFocusedListWindow(
    sortedWeapons,
    "weaponPieces",
    weapon => weapon.id
  );
  const fallbackEntity = focusWindow && !focusWindow.targetFound
    ? getFocusedFallbackEntity()
    : null;
  const fallbackWeapon = fallbackEntity && fallbackEntity.engine === "weaponPieces"
    ? fallbackEntity.data
    : null;
  const visibleWeapons = focusWindow
    ? (focusWindow.targetFound ? focusWindow.items : (fallbackWeapon ? [fallbackWeapon] : []))
    : sortedWeapons.slice(0, visibleResultCount);

  resultList.innerHTML = renderFocusedListNotice(focusWindow);
  resultCount.textContent = sortedWeapons.length;
  activeFilters.textContent = [
    `当前筛选：${getEngineLabel(currentEngine)}`,
    keyword ? `关键词：${keyword}` : "",
    selectedWeaponType !== "all" ? `武器类型：${selectedWeaponType}` : "",
    selectedMainHandOnly ? "只看主手" : "",
    selectedOffHandOnly ? "只看副手" : "",
    selectedSourceCategory !== "all" ? gearSetSourceCategoryFilter.options[gearSetSourceCategoryFilter.selectedIndex].text : "",
    selectedSourceSubcategory !== "all" ? gearSetSourceSubcategoryFilter.options[gearSetSourceSubcategoryFilter.selectedIndex].text : "",
    selectedSourceDetail !== "all" ? gearSetSourceDetailFilter.options[gearSetSourceDetailFilter.selectedIndex].text : ""
  ].filter(Boolean).join(" / ");

  if (sortedWeapons.length === 0 && !fallbackWeapon) {
    resultList.innerHTML = `
      <div class="empty-result">
        <p>没有找到符合条件的武器。</p>
        <p class="empty-result-tip">如果你还没导入武器，先按 WEAPON-WORKFLOW.md 在 VSCode 里生成 weapon-data.json。</p>
      </div>
    `;
    loadMoreButton.classList.add("hidden");
    return;
  }

  if (focusWindow) {
    loadMoreButton.classList.add("hidden");
  } else if (visibleResultCount < sortedWeapons.length) {
    loadMoreButton.classList.remove("hidden");
    loadMoreButton.textContent = `加载更多（已显示 ${visibleWeapons.length} / 共 ${sortedWeapons.length} 条）`;
  } else {
    loadMoreButton.classList.add("hidden");
  }

  visibleWeapons.forEach(weapon => {
    const div = document.createElement("div");
    div.className = String(weapon.id) === String(selectedWeaponId)
      ? "item-card selected-card"
      : "item-card";
    div.dataset.engine = "weaponPieces";
    div.dataset.id = String(weapon.id);

    div.innerHTML = `
      <img class="item-icon" src="${weapon.icon}" alt="${weapon.name}">
      ${renderWishlistButton("weaponPieces", weapon.id)}
      <div class="item-info">
        <strong>${weapon.name}</strong>
        <span class="item-id-hint">#${weapon.id}</span><br>
        武器类别：${renderWeaponCategory(weapon)}<br>
        品级：${weapon.itemLevel} / 装备等级：${weapon.equipLevel}<br>
        ${renderWeaponStructureSummary(weapon)}<br>
        获取方式：${getSourceText(weapon)}

        <div class="tag-line">
          ${renderDyeDots(weapon)}
        </div>
      </div>
    `;

    div.addEventListener("click", (event) => {
      if (event.target.closest(".wishlist-toggle-button")) {
        return;
      }

  selectedWeaponId = weapon.id;
  selectedItemId = null;
  selectedSetRoute = null;
  selectedSeriesId = null;
  isSameModelExpanded = false;
  isSameModelGalleryExpanded = false;
  showWeaponDetail(weapon);
  updateSelectedWeaponCardHighlight();

  updateCurrentEngineStatePatch({
    filterState: getFilterStateFromControls(),
    visibleResultCount,
    selectedItemId,
    selectedSetRoute,
    selectedSeriesId,
    selectedWeaponId,
    detailHtml: getDetailHtmlForState(),
    isSameModelExpanded
  });
});

    resultList.appendChild(div);
  });

  scrollSelectedWeaponIntoView();
}

function scrollSelectedWeaponIntoView() {
  if (skipSelectedScrollOnce) {
    skipSelectedScrollOnce = false;
    return;
  }

  if (selectedWeaponId === null || currentEngine !== "weaponPieces") {
    return;
  }

  const selector = `[data-engine="weaponPieces"][data-id="${String(selectedWeaponId)}"]`;
  const selectedCard = resultList.querySelector(selector);

  if (!selectedCard) {
    return;
  }

  selectedCard.scrollIntoView({
    block: "center",
    behavior: "smooth"
  });
}

function scrollSelectedSetIntoView() {
  if (skipSelectedScrollOnce) {
    skipSelectedScrollOnce = false;
    return;
  }

  if (!selectedSetRoute || currentEngine !== "gearSets") {
    return;
  }

  const selector = `[data-engine="${selectedSetRoute.engine}"][data-id="${String(selectedSetRoute.id)}"]`;
  const selectedCard = resultList.querySelector(selector);

  if (!selectedCard) {
    return;
  }

  selectedCard.scrollIntoView({
    block: "center",
    behavior: "smooth"
  });
}

function updateEngineTabs() {
  engineTabs.forEach(tab => {
    tab.classList.toggle("active", tab.dataset.engine === currentEngine);
  });
}

function renderEnginePlaceholder() {
  const label = getEngineLabel(currentEngine);
  const count = getEngineCount(currentEngine);

  renderActiveFilters();
  resultCount.textContent = count;
  loadMoreButton.classList.add("hidden");
  resultList.innerHTML = `
    <div class="empty-result">
      <p>${label}引擎已经预留。</p>
      <p class="empty-result-tip">
        当前已读取 ${count} 条相关数据。这个界面的列表、筛选和详情页会在后续步骤接入。
      </p>
    </div>
  `;
}

const MODAL_ZOOM_LEVELS = [1, 1.5, 2];
let modalZoomIndex = 0;
let modalZoom = 1;
let modalZoomOrigin = "center center";

function updateModalZoom() {
  modalImage.style.transform = `scale(${modalZoom})`;
  modalImage.style.transformOrigin = modalZoomOrigin;
  zoomResetButton.textContent = `${Math.round(modalZoom * 100)}%`;
}

function setZoomOriginFromClick(event) {
  const rect = modalImage.getBoundingClientRect();

  const x = ((event.clientX - rect.left) / rect.width) * 100;
  const y = ((event.clientY - rect.top) / rect.height) * 100;

  modalZoomOrigin = `${x}% ${y}%`;
}

function setModalZoomByIndex(index) {
  modalZoomIndex = Math.max(0, Math.min(MODAL_ZOOM_LEVELS.length - 1, index));
  modalZoom = MODAL_ZOOM_LEVELS[modalZoomIndex];
  updateModalZoom();
}

function openImageModal(imageSrc, caption) {
  if (!imageSrc) {
    return;
  }

  modalImage.src = imageSrc;
  modalImage.alt = caption || "装备预览图";
  modalCaption.textContent = caption || "";

  modalZoomOrigin = "center center";
 setModalZoomByIndex(0);

  imageModal.classList.remove("hidden");
}

function closeModal() {
  imageModal.classList.add("hidden");
  modalImage.src = "";
  modalCaption.textContent = "";

  modalZoomOrigin = "center center";
  setModalZoomByIndex(0);
}

function zoomInModalImage() {
  setModalZoomByIndex(modalZoomIndex + 1);
}

function zoomOutModalImage() {
  setModalZoomByIndex(modalZoomIndex - 1);
}

function validateGearData() {
  const seenIds = new Set();

  items.forEach(item => {
    const problems = [];
const notes = [];

    // 1. 检查 ID
    if (item.id === undefined || item.id === null || item.id === "") {
      problems.push("缺少 id");
    } else {
      if (seenIds.has(item.id)) {
        problems.push(`id 重复：${item.id}`);
      }
      seenIds.add(item.id);
    }

    // 2. 检查基础字段
    if (!item.name) {
  problems.push("缺少 name");
}

if (!item.type) {
  problems.push("缺少 type");
} else if (!VALID_ITEM_TYPES.includes(item.type)) {
  problems.push(`type 不合法：${item.type}`);
}

if (!item.equipSlot) {
  problems.push("缺少 equipSlot");
} else if (!VALID_EQUIP_SLOTS.includes(item.equipSlot)) {
  problems.push(`equipSlot 不合法：${item.equipSlot}`);
}

if (!Array.isArray(item.visualSlots)) {
  problems.push("visualSlots 必须是数组");
}

    // 3. 检查等级字段
    if (typeof item.itemLevel !== "number") problems.push("itemLevel 必须是数字");
    if (typeof item.equipLevel !== "number") problems.push("equipLevel 必须是数字");

    // 4. 检查布尔字段
    const booleanFields = [
      "canDye",
      "canDualDye",
      "canDresser",
      "canDresserSet",
      "canArmoire",
      "canCrest",
      "isUnique",
      "canSellOnMarket"
    ];

    booleanFields.forEach(field => {
      if (typeof item[field] !== "boolean") {
        problems.push(`${field} 必须是 true 或 false`);
      }
    });

    // 5. 检查套装字段
    if (item.type === "套装") {
      if (!Array.isArray(item.setPieces)) {
        problems.push("套装缺少 setPieces，或 setPieces 不是数组");
      }
    }

    // 6. 检查散件字段
    if (item.type === "散件") {
      if (item.equipSlot === "套装") {
        problems.push("散件的 equipSlot 不应该是 套装");
      }
    }

    // 7. 检查获取方式
    if (!item.source) {
      problems.push("缺少 source");
    }

    if (item.sources !== undefined) {
  if (!Array.isArray(item.sources)) {
    problems.push("sources 必须是数组");
  } else {
    item.sources.forEach((source, index) => {
      if (!source.type) {
        problems.push(`sources[${index}] 缺少 type`);
      } else if (!VALID_SOURCE_TYPES.includes(source.type)) {
        problems.push(`sources[${index}].type 不合法：${source.type}`);
      }

      if (source.price !== undefined && source.price !== null && typeof source.price !== "number") {
        problems.push(`sources[${index}].price 必须是数字或 null`);
      }

      if (source.currencySource !== undefined && source.currencySource !== null) {
        if (typeof source.currencySource !== "object") {
          problems.push(`sources[${index}].currencySource 必须是对象或 null`);
        }
      }
    });
  }
}

    // 8. 检查同模字段
    if (!item.modelKey) {
      problems.push("缺少 modelKey");
    }

    if (item.sourceSummary === undefined) {
  notes.push("未来字段：缺少 sourceSummary");
}

if (item.sources === undefined) {
  notes.push("未来字段：缺少 sources");
}

    // 9. 检查图标
    if (!item.icon) {
      problems.push("缺少 icon");
    }

    // 10. 检查 previewImages 的结构，不检查图片是否已经填写
if (!item.previewImages) {
  problems.push("缺少 previewImages");
} else {
  PREVIEW_IMAGE_GROUPS.forEach(group => {
    const entry = item.previewImages[group];

    if (entry === undefined) {
      problems.push(`previewImages 缺少 ${group}`);
      return;
    }

    const isOldStringFormat = typeof entry === "string";
    const isNewObjectFormat = typeof entry === "object" && entry !== null;

    if (!isOldStringFormat && !isNewObjectFormat) {
      problems.push(`previewImages.${group} 格式不正确`);
      return;
    }

    if (isNewObjectFormat) {
      if (
        entry.common === undefined ||
        entry.male === undefined ||
        entry.female === undefined
      ) {
        problems.push(`previewImages.${group} 应包含 common / male / female`);
      }
    }
  });
}

    // 11. 输出问题
   if (problems.length > 0) {
  console.warn(`装备数据严重问题：${item.name || "未命名装备"}`, problems, item);
}

if (SHOW_DATA_NOTES && notes.length > 0) {
  console.info(`装备数据预留提醒：${item.name || "未命名装备"}`, notes);
}
  });

  console.log(`装备数据检查完成，共检查 ${items.length} 条装备。`);
}

function renderList() {
updateEngineTabs();
updateFilterPanelForEngine();

if (currentEngine !== "gearPieces") {
  if (currentEngine === "gearSets") {
    renderGearSetList();
    return;
  }

  if (currentEngine === "gearSeries") {
    renderGearSeriesList();
    return;
  }

  if (currentEngine === "weaponPieces") {
    if (!weaponDataLoaded) {
      resultCount.textContent = "0";
      activeFilters.textContent = `当前筛选：${getEngineLabel(currentEngine)}`;
      loadMoreButton.classList.add("hidden");
      resultList.innerHTML = `
        <div class="empty-result">
          <p>正在加载武器数据。</p>
          <p class="empty-result-tip">武器数据会在第一次进入武器引擎时读取，之后切换会保留在页面内存里。</p>
        </div>
      `;

      loadWeaponData()
        .then(() => {
          if (currentEngine === "weaponPieces") {
            renderList();
          }
        })
        .catch(error => {
          console.error("武器数据加载失败：", error);
          resultList.innerHTML = `
            <div class="empty-result">
              <p>武器数据加载失败。</p>
              <p class="empty-result-tip">请检查 weapon-data.json 或 weapon-series.json。</p>
            </div>
          `;
        });
      return;
    }

    renderWeaponList();
    return;
  }

  if (currentEngine === "weaponSeries" && !weaponDataLoaded) {
    resultCount.textContent = "0";
    activeFilters.textContent = `当前筛选：${getEngineLabel(currentEngine)}`;
    loadMoreButton.classList.add("hidden");
    resultList.innerHTML = `
      <div class="empty-result">
        <p>正在加载武器数据。</p>
        <p class="empty-result-tip">武器系列会和武器散件数据一起读取。</p>
      </div>
    `;

    loadWeaponData()
      .then(() => {
        if (currentEngine === "weaponSeries") {
          renderList();
        }
      })
      .catch(error => {
        console.error("武器数据加载失败：", error);
        resultList.innerHTML = `
          <div class="empty-result">
            <p>武器数据加载失败。</p>
            <p class="empty-result-tip">请检查 weapon-data.json 或 weapon-series.json。</p>
          </div>
        `;
      });
    return;
  }

  if (currentEngine === "wishlist") {
    if (!weaponDataLoaded) {
      resultCount.textContent = "0";
      activeFilters.textContent = "当前筛选：愿望单";
      loadMoreButton.classList.add("hidden");
      resultList.innerHTML = `
        <div class="empty-result">
          <p>正在加载愿望单数据。</p>
          <p class="empty-result-tip">愿望单会同时读取装备与武器数据。</p>
        </div>
      `;

      loadWeaponData()
        .then(() => {
          if (currentEngine === "wishlist") {
            renderWishlistList();
          }
        })
        .catch(error => {
          console.error("愿望单武器数据加载失败：", error);
          if (currentEngine === "wishlist") {
            renderWishlistList();
          }
        });
      return;
    }

    renderWishlistList();
    return;
  }

  renderEnginePlaceholder();
  return;
}

const keyword = searchInput.value.trim();
const selectedEquipSlot = equipSlotFilter.value;
const selectedArmorOnly = armorOnly.checked;
const selectedAccessoryOnly = accessoryOnly.checked;
const minItemLevel = minItemLevelInput.value === ""
  ? 0
  : Number(minItemLevelInput.value);

const maxItemLevel = maxItemLevelInput.value === ""
  ? Infinity
  : Number(maxItemLevelInput.value);

const minEquipLevel = minEquipLevelInput.value === ""
  ? 0
  : Number(minEquipLevelInput.value);

const maxEquipLevel = maxEquipLevelInput.value === ""
  ? Infinity
  : Number(maxEquipLevelInput.value);
  const selectedSource = sourceFilter.value;

  const filteredItems = items.filter(item => {
    if (item.isBanned) {
      return false;
    }

    const matchKeyword =
      item.name.includes(keyword) ||
      item.equipSlot.includes(keyword) ||
      item.visualSlots.join("").includes(keyword);

    const matchEquipSlot =
  selectedEquipSlot === "all" || item.equipSlot === selectedEquipSlot;
const matchSlotCategory =
  (!selectedArmorOnly && !selectedAccessoryOnly) ||
  (selectedArmorOnly && item.slotCategory === "防具") ||
  (selectedAccessoryOnly && item.slotCategory === "饰品");

const matchItemLevel =
  item.itemLevel >= minItemLevel && item.itemLevel <= maxItemLevel;

const matchEquipLevel =
  item.equipLevel >= minEquipLevel && item.equipLevel <= maxEquipLevel;
    const matchSource =
  (selectedSource === "all" || hasSourceType(item, selectedSource)) &&
  gearPieceMatchesSourceFilters(item);
  const matchMarket = !marketOnly.checked || item.canSellOnMarket;
    const matchDye = itemMatchesDyeFilters(item);
    const matchDresser = !dresserOnly.checked || item.canDresser;
    const matchDresserSet = !dresserSetOnly.checked || item.canDresserSet;
    const matchArmoire = !armoireOnly.checked || item.canArmoire;
    const matchCrest = !crestOnly.checked || item.canCrest;

return (
  matchKeyword &&
  matchEquipSlot &&
  matchSlotCategory &&
  matchItemLevel &&
  matchEquipLevel &&
  matchSource &&
  matchMarket &&
  matchDye &&
  matchDresser &&
  matchDresserSet &&
  matchArmoire &&
  matchCrest
  &&
  gearPieceMatchesCollectionFilters(item)
);
  });

const recommendedFilteredItems = recommendedGearOnly.checked
  ? filteredItems.filter(isRecommendedGearPiece)
  : filteredItems;

const sortedItems = sortItems(recommendedFilteredItems);

const focusWindow = getFocusedListWindow(
  sortedItems,
  "gearPieces",
  item => item.id
);
const fallbackEntity = focusWindow && !focusWindow.targetFound
  ? getFocusedFallbackEntity()
  : null;
const fallbackItem = fallbackEntity && fallbackEntity.engine === "gearPieces"
  ? fallbackEntity.data
  : null;
const visibleItems = focusWindow
  ? (focusWindow.targetFound ? focusWindow.items : (fallbackItem ? [fallbackItem] : []))
  : sortedItems.slice(0, visibleResultCount);

renderActiveFilters();

resultList.innerHTML = renderFocusedListNotice(focusWindow);
resultCount.textContent = sortedItems.length;

if (sortedItems.length === 0 && !fallbackItem) {
  resultList.innerHTML = `
    <div class="empty-result">
      <p>没有找到符合条件的装备。</p>
      <p class="empty-result-tip">
        可以尝试清空关键词、降低品级/装备等级，或减少筛选条件。
      </p>
    </div>
  `;

  loadMoreButton.classList.add("hidden");
  return;
}

if (focusWindow) {
  loadMoreButton.classList.add("hidden");
} else if (visibleResultCount < sortedItems.length) {
  loadMoreButton.classList.remove("hidden");
  loadMoreButton.textContent = `加载更多（已显示 ${visibleItems.length} / 共 ${sortedItems.length} 条）`;
} else {
  loadMoreButton.classList.add("hidden");
}

visibleItems.forEach(item => {
    const div = document.createElement("div");

    if (item.id === selectedItemId) {
      div.className = "item-card selected-card";
    } else {
      div.className = "item-card";
    }

    div.dataset.engine = "gearPieces";
    div.dataset.id = String(item.id);

    div.innerHTML = `
      <img class="item-icon" src="${item.icon}" alt="${item.name}">
      ${renderWishlistButton("gearPieces", item.id)}
      <div class="item-info">
        <strong>${item.name}</strong>
        <span class="item-id-hint">#${item.id}</span><br>
        类型：${item.type}<br>
品级：${item.itemLevel} / 装备等级：${item.equipLevel}<br>
${renderStructureSummary(item)}<br>
获取方式：${getSourceText(item)}

        <div class="tag-line">
          ${renderArmoireTag(item)}
          ${renderDyeDots(item)}
          ${renderDresserTag(item)}
          ${renderCrestTag(item)}
        </div>
      </div>
    `;

    div.addEventListener("click", (event) => {
      if (event.target.closest(".wishlist-toggle-button")) {
        return;
      }

  selectedItemId = item.id;
  selectedSetRoute = null;
  selectedSeriesId = null;
  selectedWeaponId = null;
  isSameModelExpanded = false;
  isSameModelGalleryExpanded = false;
  showDetailById(item.id, { renderList: false }).catch(renderDetailLoadError);
});

    resultList.appendChild(div);
  });

scrollSelectedItemIntoView();
}

function resetFilterControlsOnly() {
  searchInput.value = "";
  armorOnly.checked = false;
  accessoryOnly.checked = false;
  mainHandOnly.checked = false;
  offHandOnly.checked = false;
  renderEquipSlotOptions();
  equipSlotFilter.value = "all";
  renderWeaponTypeOptions();
  weaponTypeFilter.value = "all";
  minItemLevelInput.value = "";
  maxItemLevelInput.value = "";
  minEquipLevelInput.value = "";
  maxEquipLevelInput.value = "";
  sourceFilter.value = "all";
  gearSetSourceCategoryFilter.value = "all";
  updateGearSetSubcategoryOptions();
  gearSetSourceSubcategoryFilter.value = "all";
  updateGearSetDetailOptions();
  gearSetSourceDetailFilter.value = "all";
  gearSetDresserSetOnly.checked = false;
  gearSetLooseOnly.checked = false;
  gearSetArmoireOnly.checked = false;
  gearSetNotArmoireOnly.checked = false;
  gearSetHasModelLinksOnly.checked = false;
  gearSetNoModelLinksOnly.checked = false;
  sortFilter.value = "default";
  marketOnly.checked = false;
  noDyeOnly.checked = false;
  dyeOnly.checked = false;
  dualDyeOnly.checked = false;
  dresserOnly.checked = false;
  dresserSetOnly.checked = false;
  armoireOnly.checked = false;
  crestOnly.checked = false;
}

function resetFilters() {
  invalidateDetailLoad();
  focusedListWindow = null;
  resetFilterControlsOnly();

  if (currentEngine === "gearPieces") {
    selectedItemId = null;
  } else if (currentEngine === "gearSets") {
    selectedSetRoute = null;
  } else if (currentEngine === "gearSeries") {
    selectedSeriesId = null;
  } else if (currentEngine === "weaponPieces") {
    selectedWeaponId = null;
  }

  visibleResultCount = PAGE_SIZE;
  detailBox.innerHTML = "请选择词条。";
  saveCurrentEngineState();

  renderList();
}

function clearCurrentEngineSelection() {
  if (currentEngine === "gearPieces") {
    selectedItemId = null;
    return;
  }

  if (currentEngine === "gearSets") {
    selectedSetRoute = null;
    return;
  }

  if (currentEngine === "gearSeries") {
    selectedSeriesId = null;
    return;
  }

  if (currentEngine === "weaponPieces") {
    selectedWeaponId = null;
  }
}

function scrollSelectedItemIntoView() {
  if (skipSelectedScrollOnce) {
    skipSelectedScrollOnce = false;
    return;
  }

  if (selectedItemId === null || currentEngine !== "gearPieces") {
    return;
  }

  const selector = `[data-engine="gearPieces"][data-id="${String(selectedItemId)}"]`;
  const selectedCard = resultList.querySelector(selector);

  if (!selectedCard) {
    return;
  }

  selectedCard.scrollIntoView({
    block: "center",
    behavior: "smooth"
  });
}

function getResultScrollContainer() {
  let element = resultList.parentElement;

  while (element && element !== document.body) {
    const style = window.getComputedStyle(element);
    const canScrollY =
      style.overflowY === "auto" ||
      style.overflowY === "scroll";

    if (canScrollY && element.scrollHeight > element.clientHeight) {
      return element;
    }

    element = element.parentElement;
  }

  return document.scrollingElement || document.documentElement;
}

function scrollPageByAmount(amount) {
  const target = getResultScrollContainer();

  target.scrollBy({
    top: amount,
    behavior: "smooth"
  });
}

function scrollPageToTop() {
  const target = getResultScrollContainer();

  target.scrollTo({
    top: 0,
    behavior: "smooth"
  });
}

function scrollCurrentSelectionIntoView() {
  if (currentEngine === "gearPieces") {
    scrollSelectedItemIntoView();
    return;
  }

  if (currentEngine === "gearSets") {
    scrollSelectedSetIntoView();
    return;
  }

  if (currentEngine === "gearSeries") {
    scrollSelectedSeriesIntoView();
    return;
  }

  if (currentEngine === "weaponPieces") {
    scrollSelectedWeaponIntoView();
  }
}

async function showDetailById(itemId, options = {}) {
  const detailVersion = startDetailLoad();
  const shouldRenderList = options.renderList !== false;
  const route = {
    engine: "gearPieces",
    id: itemId
  };
  const listItem = getEntityData(route);

  if (!listItem) {
    return;
  }

  selectedItemId = listItem.id;
  selectedSetRoute = null;
  selectedSeriesId = null;
  selectedWeaponId = null;
  isSameModelExpanded = false;
  isSameModelGalleryExpanded = false;

  if (!fullGearDataLoaded) {
    renderDetailLoading("正在加载装备完整详情。");
    if (shouldRenderList) {
      renderList();
    } else {
      updateSelectedItemCardHighlight();
    }
    try {
      await loadFullGearData();
    } catch (error) {
      if (!isCurrentDetailLoad(detailVersion)) {
        return;
      }

      throw error;
    }

    if (!isCurrentDetailLoad(detailVersion)) {
      return;
    }
  }

  const targetItem = getEntityData(route);

  if (!targetItem || !isCurrentDetailLoad(detailVersion)) {
    return;
  }

  showDetail(targetItem);
  if (shouldRenderList) {
    renderList();
  } else {
    updateSelectedItemCardHighlight();
  }
  updateCurrentEngineStatePatch({
    filterState: getFilterStateFromControls(),
    visibleResultCount,
    selectedItemId,
    selectedSetRoute,
    selectedSeriesId,
    selectedWeaponId,
    detailHtml: getDetailHtmlForState(),
    isSameModelExpanded
  });
}

function showWeaponDetailById(itemId, options = {}) {
  const shouldRenderList = options.renderList !== false;
  const targetWeapon = getEntityData({
    engine: "weaponPieces",
    id: itemId
  });

  if (!targetWeapon) {
    return;
  }

  selectedWeaponId = targetWeapon.id;
  selectedItemId = null;
  selectedSetRoute = null;
  selectedSeriesId = null;
  isSameModelExpanded = false;
  isSameModelGalleryExpanded = false;
  showWeaponDetail(targetWeapon);
  if (shouldRenderList) {
    renderList();
  } else {
    updateSelectedWeaponCardHighlight();
  }
  updateCurrentEngineStatePatch({
    filterState: getFilterStateFromControls(),
    visibleResultCount,
    selectedItemId,
    selectedSetRoute,
    selectedSeriesId,
    selectedWeaponId,
    detailHtml: getDetailHtmlForState(),
    isSameModelExpanded
  });
}

async function navigateToEntity(engine, id) {
  const entity = resolveEntity({ engine, id });

  if (!entity) {
    return;
  }

  saveCurrentEngineState();

  if (entity.engine === "gearPieces") {
    currentEngine = "gearPieces";
    restoreEngineState(currentEngine);
    focusListWindow("gearPieces", entity.id, {
      label: entity.data.name,
      entityEngine: entity.engine,
      entityId: entity.id
    });
    showDetailById(entity.id).catch(renderDetailLoadError);
    return;
  }

  if (entity.engine === "weaponPieces") {
    currentEngine = "weaponPieces";
    restoreEngineState(currentEngine);
    focusListWindow("weaponPieces", entity.id, {
      label: entity.data.name,
      entityEngine: entity.engine,
      entityId: entity.id
    });
    showWeaponDetailById(entity.id);
    return;
  }

  if (entity.engine === "gearSets") {
    const detailVersion = startDetailLoad();
    currentEngine = "gearSets";
    restoreEngineState(currentEngine);
    selectedSetRoute = {
      engine: entity.engine,
      id: entity.id
    };
    selectedItemId = null;
    selectedSeriesId = null;
    selectedWeaponId = null;
    isSameModelExpanded = false;
    isSameModelGalleryExpanded = false;
    focusListWindow("gearSets", makeEntityKey(entity.engine, entity.id), {
      label: entity.data.setName || `套装 ${entity.id}`,
      entityEngine: entity.engine,
      entityId: entity.id
    });
    renderList();
    try {
      if (!fullGearDataLoaded) {
        renderDetailLoading("正在加载套装完整详情。");
        await loadFullGearData();

        if (!isCurrentDetailLoad(detailVersion)) {
          return;
        }
      }

      if (!isCurrentDetailLoad(detailVersion)) {
        return;
      }

      renderOfficialGearSetDetail(entity.data);
    } catch (error) {
      if (isCurrentDetailLoad(detailVersion)) {
        renderDetailLoadError(error);
      }
    }
    updateCurrentEngineStatePatch({
      filterState: getFilterStateFromControls(),
      visibleResultCount,
      selectedItemId,
      selectedSetRoute: { ...selectedSetRoute },
      selectedSeriesId,
      selectedWeaponId,
      detailHtml: getDetailHtmlForState(),
      isSameModelExpanded
    });
    return;
  }

  if (entity.engine === "customGearSets") {
    const detailVersion = startDetailLoad();
    currentEngine = "gearSets";
    restoreEngineState(currentEngine);
    selectedSetRoute = {
      engine: entity.engine,
      id: entity.id
    };
    selectedItemId = null;
    selectedSeriesId = null;
    selectedWeaponId = null;
    isSameModelExpanded = false;
    isSameModelGalleryExpanded = false;
    focusListWindow("gearSets", makeEntityKey(entity.engine, entity.id), {
      label: entity.data.name || entity.id,
      entityEngine: entity.engine,
      entityId: entity.id
    });
    renderList();
    try {
      if (!fullGearDataLoaded) {
        renderDetailLoading("正在加载自定义套装完整详情。");
        await loadFullGearData();

        if (!isCurrentDetailLoad(detailVersion)) {
          return;
        }
      }

      if (!isCurrentDetailLoad(detailVersion)) {
        return;
      }

      renderCustomGearSetDetail(entity.data);
    } catch (error) {
      if (isCurrentDetailLoad(detailVersion)) {
        renderDetailLoadError(error);
      }
    }
    updateCurrentEngineStatePatch({
      filterState: getFilterStateFromControls(),
      visibleResultCount,
      selectedItemId,
      selectedSetRoute: { ...selectedSetRoute },
      selectedSeriesId,
      selectedWeaponId,
      detailHtml: getDetailHtmlForState(),
      isSameModelExpanded
    });
    return;
  }

  if (entity.engine === "gearSeries") {
    const detailVersion = startDetailLoad();
    currentEngine = "gearSeries";
    restoreEngineState(currentEngine);
    selectedSeriesId = entity.id;
    selectedItemId = null;
    selectedSetRoute = null;
    selectedWeaponId = null;
    isSameModelExpanded = false;
    isSameModelGalleryExpanded = false;
    focusListWindow("gearSeries", entity.id, {
      label: entity.data.name,
      entityEngine: entity.engine,
      entityId: entity.id
    });
    renderList();
    try {
      if (!fullGearDataLoaded) {
        renderDetailLoading("正在加载系列完整详情。");
        await loadFullGearData();

        if (!isCurrentDetailLoad(detailVersion)) {
          return;
        }
      }

      if (!isCurrentDetailLoad(detailVersion)) {
        return;
      }

      renderGearSeriesDetail(entity.data);
    } catch (error) {
      if (isCurrentDetailLoad(detailVersion)) {
        renderDetailLoadError(error);
      }
    }
    updateCurrentEngineStatePatch({
      filterState: getFilterStateFromControls(),
      visibleResultCount,
      selectedItemId,
      selectedSetRoute,
      selectedSeriesId,
      selectedWeaponId,
      detailHtml: getDetailHtmlForState(),
      isSameModelExpanded
    });
  }
}

function navigateToItem(itemId) {
  navigateToEntity("gearPieces", itemId);
}

function navigateToWeapon(itemId) {
  navigateToEntity("weaponPieces", itemId);
}

function getModelCompareKey(item) {
  if (item.modelGroupKey) {
    return item.modelGroupKey;
  }

  return item.modelKey || "";
}

function toggleSameModelExpanded() {
  isSameModelExpanded = !isSameModelExpanded;

  if (currentEngine === "weaponPieces") {
    if (selectedWeaponId === null) {
      return;
    }

    const currentWeapon = weaponItems.find(weapon => String(weapon.id) === String(selectedWeaponId));

    if (!currentWeapon) {
      return;
    }

    showWeaponDetail(currentWeapon);
    updateCurrentEngineStatePatch({
      filterState: getFilterStateFromControls(),
      visibleResultCount,
      selectedItemId,
      selectedSetRoute,
      selectedSeriesId,
      selectedWeaponId,
      detailHtml: getDetailHtmlForState(),
      isSameModelExpanded
    });
    return;
  }

  if (selectedItemId === null) {
    return;
  }

  const currentItem = items.find(item => String(item.id) === String(selectedItemId));

  if (!currentItem) {
    return;
  }

  showDetail(currentItem);
  updateCurrentEngineStatePatch({
    filterState: getFilterStateFromControls(),
    visibleResultCount,
    selectedItemId,
    selectedSetRoute,
    selectedSeriesId,
    selectedWeaponId,
    detailHtml: getDetailHtmlForState(),
    isSameModelExpanded
  });
}

function toggleSameModelGalleryExpanded() {
  isSameModelGalleryExpanded = !isSameModelGalleryExpanded;

  if (currentEngine === "weaponPieces") {
    if (selectedWeaponId === null) {
      return;
    }

    const currentWeapon = weaponItems.find(weapon => String(weapon.id) === String(selectedWeaponId));

    if (!currentWeapon) {
      return;
    }

    showWeaponDetail(currentWeapon);
    updateCurrentEngineStatePatch({
      filterState: getFilterStateFromControls(),
      visibleResultCount,
      selectedItemId,
      selectedSetRoute,
      selectedSeriesId,
      selectedWeaponId,
      detailHtml: getDetailHtmlForState(),
      isSameModelGalleryExpanded
    });
    return;
  }

  if (selectedItemId === null) {
    return;
  }

  const currentItem = items.find(item => String(item.id) === String(selectedItemId));

  if (!currentItem) {
    return;
  }

  showDetail(currentItem);
  updateCurrentEngineStatePatch({
    filterState: getFilterStateFromControls(),
    visibleResultCount,
    selectedItemId,
    selectedSetRoute,
    selectedSeriesId,
    selectedWeaponId,
    detailHtml: getDetailHtmlForState(),
    isSameModelGalleryExpanded
  });
}

function getSameModelSortScore(item) {
  let score = 0;

  if (item.canArmoire) {
    score += 10000;
  }

  if (item.canDualDye) {
    score += 1000;
  } else if (item.canDye) {
    score += 500;
  }

  if (item.canDresserSet) {
    score += 100;
  }

  if (item.canCrest) {
    score += 10;
  }

  return score;
}

function isReplicaItem(item) {
  return String(item?.name || "").includes("复制品");
}

function getNumericItemId(item) {
  const value = Number(item?.id || 0);
  return Number.isFinite(value) ? value : 0;
}

function sortSameModelItems(sameModelItems, currentItem = null) {
  return [...sameModelItems].sort((a, b) => {
    const aIsCurrent = currentItem && String(a.id) === String(currentItem.id);
    const bIsCurrent = currentItem && String(b.id) === String(currentItem.id);

    if (aIsCurrent && !bIsCurrent) {
      return -1;
    }

    if (!aIsCurrent && bIsCurrent) {
      return 1;
    }

    const replicaDiff = Number(isReplicaItem(a)) - Number(isReplicaItem(b));

    if (replicaDiff !== 0) {
      return replicaDiff;
    }

    const scoreDiff = getSameModelSortScore(b) - getSameModelSortScore(a);

    if (scoreDiff !== 0) {
      return scoreDiff;
    }

    const itemIdDiff = getNumericItemId(b) - getNumericItemId(a);

    if (itemIdDiff !== 0) {
      return itemIdDiff;
    }

    const itemLevelDiff = (b.itemLevel || 0) - (a.itemLevel || 0);

    if (itemLevelDiff !== 0) {
      return itemLevelDiff;
    }

    const equipLevelDiff = (b.equipLevel || 0) - (a.equipLevel || 0);

    if (equipLevelDiff !== 0) {
      return equipLevelDiff;
    }

    return String(a.name).localeCompare(String(b.name), "zh-Hans-CN");
  });
}

function isRecommendedGearPiece(item) {
  const indexKey = getGearSameModelIndexKey(item);

  if (!indexKey) {
    return true;
  }

  const sameModelItems = gearItemsByModelKey[indexKey] || [];

  if (sameModelItems.length <= 1) {
    return true;
  }

  const recommendedItem = sortSameModelItems(sameModelItems)[0];

  return recommendedItem && String(recommendedItem.id) === String(item.id);
}

function getGearSetRecommendationScore(setItem) {
  const key = getGearSetListItemKey(setItem);

  if (gearSetRecommendationScoreByKey.has(key)) {
    return gearSetRecommendationScoreByKey.get(key);
  }

  let score = 0;

  if (gearSetCanArmoire(setItem)) {
    score += 10000;
  }

  if (gearSetCanDualDye(setItem)) {
    score += 1000;
  } else if (gearSetCanDye(setItem)) {
    score += 500;
  }

  if (gearSetCanDresserSet(setItem)) {
    score += 100;
  }

  return score;
}

function getGearSetRecommendationLevel(setItem, fieldName) {
  return getGearSetMaxNumber(setItem, fieldName);
}

function sortRecommendedGearSets(setItems) {
  return [...setItems].sort((a, b) => {
    const replicaDiff = Number(isReplicaItem(a)) - Number(isReplicaItem(b));

    if (replicaDiff !== 0) {
      return replicaDiff;
    }

    const scoreDiff = getGearSetRecommendationScore(b) - getGearSetRecommendationScore(a);

    if (scoreDiff !== 0) {
      return scoreDiff;
    }

    const itemLevelDiff =
      getGearSetRecommendationLevel(b, "itemLevel") -
      getGearSetRecommendationLevel(a, "itemLevel");

    if (itemLevelDiff !== 0) {
      return itemLevelDiff;
    }

    const equipLevelDiff =
      getGearSetRecommendationLevel(b, "equipLevel") -
      getGearSetRecommendationLevel(a, "equipLevel");

    if (equipLevelDiff !== 0) {
      return equipLevelDiff;
    }

    return String(a.name).localeCompare(String(b.name), "zh-Hans-CN");
  });
}

function isRecommendedGearSet(setItem) {
  return gearSetRecommendedKeys.has(getGearSetListItemKey(setItem));
}

function showDetail(item) {
  refreshDetailAfterBattleCofferIndexLoads("gearPieces", item.id);
  refreshDetailAfterRecipeCraftIndexLoads("gearPieces", item.id);
  refreshDetailAfterNpcLocationIndexLoads("gearPieces", item.id);

  const sameModelItems = sortSameModelItems(
    gearItemsByModelKey[getGearSameModelIndexKey(item)] || [],
    item
  );

  const visibleSameModelItems = isSameModelExpanded
    ? sameModelItems
    : sameModelItems.slice(0, SAME_MODEL_PREVIEW_COUNT);
  const sameModelGalleryItems = sameModelItems.filter(other => {
    const images = getPreviewImages(other);
    return hasAnyPreviewImage(images.original);
  });
  const visibleSameModelGalleryItems = isSameModelGalleryExpanded || sameModelGalleryItems.length <= SAME_MODEL_GALLERY_PREVIEW_COUNT
    ? sameModelGalleryItems
    : sameModelGalleryItems.slice(0, SAME_MODEL_GALLERY_PREVIEW_COUNT);

  const hasHiddenSameModelItems = sameModelItems.length > SAME_MODEL_PREVIEW_COUNT;
  const hasHiddenSameModelGalleryItems = sameModelGalleryItems.length > SAME_MODEL_GALLERY_PREVIEW_COUNT;

  const sameModelToggleButton = hasHiddenSameModelItems
    ? `
      <button class="secondary-button same-model-toggle-button" onclick="toggleSameModelExpanded()">
        ${isSameModelExpanded ? "收起同模" : `展开全部同模（共 ${sameModelItems.length} 条）`}
      </button>
    `
    : "";
  const sameModelGalleryToggleButton = hasHiddenSameModelGalleryItems
    ? `
      <button class="secondary-button same-model-toggle-button" onclick="toggleSameModelGalleryExpanded()">
        ${isSameModelGalleryExpanded ? "收起同模图片" : `展开全部同模图片（共 ${sameModelGalleryItems.length} 件）`}
      </button>
    `
    : "";

  const comparisonRows = visibleSameModelItems.map(other => {
    const currentBadge = other.id === item.id
      ? `<span class="current-badge">当前查看</span>`
      : "";

    return `
      <tr class="${other.id === item.id ? "current-row" : ""}">
        <td>
          <span class="compare-name-cell">
            <img class="compare-name-icon" src="${other.icon}" alt="" loading="lazy">
            <button class="table-link" onclick="navigateToItem(${JSON.stringify(other.id)})">
              ${other.name}
            </button>
            <span class="compare-item-id-hint">#${other.id}</span>
          </span>
          ${currentBadge}
        </td>
        <td>${other.itemLevel}</td>
        <td>${other.equipLevel}</td>
        <td>${renderArmoireTag(other)}</td>
        <td>${renderDyeDots(other)}</td>
        <td>${renderDresserTag(other)}</td>
        <td>${renderCrestTag(other)}</td>
        <td>${getSourceText(other)}</td>
      </tr>
    `;
  }).join("");

  const sameModelGallery = visibleSameModelGalleryItems
    .map(other => {
      const images = getPreviewImages(other);

      if (!hasAnyPreviewImage(images.original)) {
        return "";
      }

      const isCurrent = other.id === item.id;

      const cardClass = [
        hasGenderSplitImage(images.original) ? "gallery-card gallery-card-wide" : "gallery-card",
        isCurrent ? "current-gallery-card" : ""
      ].join(" ");

      return `
        <div class="${cardClass}">
          ${renderPreviewBlock(images.original, other.name)}

          <div class="gallery-title">
            <button class="gallery-link" onclick="navigateToItem(${JSON.stringify(other.id)})">
              ${other.name}
            </button>
            ${isCurrent ? `<span class="current-badge">当前查看</span>` : ""}
          </div>

          <div class="gallery-meta">
            ${other.type} / ${other.equipSlot} / 染色 ${yesNo(other.canDye)} / 双染 ${yesNo(other.canDualDye)}
          </div>
        </div>
      `;
    })
    .join("");

  const currentImages = getPreviewImages(item);

  const colorImages = [
    {
      label: "原色外观",
      image: currentImages.original
    }
  ];

  if (item.canDye) {
    colorImages.push({
      label: "染色区域 1 示例",
      image: currentImages.dye1
    });
  }

  if (item.canDualDye) {
    colorImages.push({
      label: "染色区域 2 示例",
      image: currentImages.dye2
    });

    colorImages.push({
      label: "双染色示例",
      image: currentImages.dyeDouble
    });
  }

  if (item.canCrest) {
    colorImages.push({
      label: "部队徽记效果图",
      image: currentImages.crest
    });
  }

  const variantsGallery = colorImages
    .filter(imageItem => hasAnyPreviewImage(imageItem.image))
    .map(imageItem => {
      const cardClass = hasGenderSplitImage(imageItem.image)
        ? "gallery-card gallery-card-wide"
        : "gallery-card";

      return `
        <div class="${cardClass}">
          ${renderPreviewBlock(imageItem.image, imageItem.label, item.name)}
          <div class="gallery-title">${imageItem.label}</div>
        </div>
      `;
    }).join("");

  detailBox.innerHTML = `
    ${renderInfoCard(item)}

    <div class="tag-line">
      ${renderArmoireTag(item)}
      ${renderDyeDots(item)}
      ${renderDresserTag(item)}
      ${renderCrestTag(item)}
    </div>

    ${renderTradeTags(item)}

    ${renderSources(item)}
    ${renderSameSetItems(item)}

    <div class="section-title-row">
      <h4>同模信息横向对比</h4>
      ${sameModelToggleButton}
    </div>

    <table class="compare-table">
      <thead>
        <tr>
          <th>名称</th>
          <th>品级</th>
          <th>装备等级</th>
          <th>收藏柜</th>
          <th>染色状态</th>
          <th>投影台状态</th>
          <th>部队徽记</th>
          <th>获取方式</th>
        </tr>
      </thead>
      <tbody>
        ${comparisonRows}
      </tbody>
    </table>

    ${
      variantsGallery !== ""
        ? `
          <h4>当前装备配色对比</h4>
          <div class="section-note">
            此处展示原色、染色区域、双染效果与部队徽记效果；无对应能力或图片的装备不会显示相关图片。
          </div>
          <div class="gallery-row">
            ${variantsGallery}
          </div>
        `
        : ""
    }

    ${
      sameModelGallery !== ""
        ? `
          <div class="section-title-row">
            <h4>同模图片横向对比</h4>
            ${sameModelGalleryToggleButton}
          </div>
          <div class="gallery-row">
            ${sameModelGallery}
          </div>
        `
        : ""
    }
  `;
}

applyFilterButton.addEventListener("click", applyFilters);
resetButton.addEventListener("click", resetFilters);
detailBox.addEventListener("click", event => {
  const navigateButton = event.target.closest("[data-navigate-engine][data-navigate-id]");

  if (!navigateButton || !detailBox.contains(navigateButton)) {
    return;
  }

  event.preventDefault();
  navigateToEntity(navigateButton.dataset.navigateEngine, navigateButton.dataset.navigateId);
});

detailBox.addEventListener("click", event => {
  const wishlistButton = event.target.closest(".wishlist-toggle-button");

  if (!wishlistButton || !detailBox.contains(wishlistButton)) {
    return;
  }

  event.preventDefault();
  const engine = wishlistButton.dataset.wishlistEngine;
  const id = wishlistButton.dataset.wishlistId;
  const mode = wishlistButton.dataset.wishlistMode || "default";

  if (!engine || !id) {
    return;
  }

  requestToggleWishlistTarget(engine, id, mode);
});

if (topFilterBox) {
  topFilterBox.addEventListener("click", event => {
    const gilRouteButton = event.target.closest("[data-open-gil-route-planner]");

    if (gilRouteButton && topFilterBox.contains(gilRouteButton)) {
      event.preventDefault();
      openGilRoutePlanner();
      return;
    }

    const battleStatsButton = event.target.closest("[data-open-battle-stats]");

    if (battleStatsButton && topFilterBox.contains(battleStatsButton)) {
      event.preventDefault();
      openWishlistBattleStatsModal();
    }
  });
}

resultList.addEventListener("click", event => {
  const gilRouteButton = event.target.closest("[data-open-gil-route-planner]");

  if (gilRouteButton && resultList.contains(gilRouteButton)) {
    event.preventDefault();
    openGilRoutePlanner();
    return;
  }

  const battleStatsButton = event.target.closest("[data-open-battle-stats]");

  if (battleStatsButton && resultList.contains(battleStatsButton)) {
    event.preventDefault();
    openWishlistBattleStatsModal();
    return;
  }

  const wishlistToggle = event.target.closest(".wishlist-toggle-button");

  if (wishlistToggle && resultList.contains(wishlistToggle)) {
    event.preventDefault();
    event.stopPropagation();

    var engine = wishlistToggle.dataset.wishlistEngine;
    var id = wishlistToggle.dataset.wishlistId;
    var mode = wishlistToggle.dataset.wishlistMode || "default";

    if (engine && id) {
      requestToggleWishlistTarget(engine, id, mode);
    }

    return;
  }

  const removeButton = event.target.closest("[data-wishlist-remove]");

  if (removeButton) {
    event.preventDefault();
    const engine = removeButton.dataset.wishlistRemove;
    const id = removeButton.dataset.wishlistId;
    if (engine && id) {
      removeWishlistEntry(engine, id);
      syncWishlistButtonsForEntity(engine, id);
      renderWishlistList();
    }
    return;
  }

  const acquiredButton = event.target.closest("[data-wishlist-acquired]");

  if (acquiredButton) {
    event.preventDefault();
    const engine = acquiredButton.dataset.wishlistAcquired;
    const id = acquiredButton.dataset.wishlistId;
    if (engine && id) {
      const newStatus = acquiredButton.dataset.wishlistStatus === "acquired" ? "wanted" : "acquired";
      updateWishlistEntry(engine, id, { status: newStatus });
      renderWishlistList();
    }
    return;
  }

  const navigateButton = event.target.closest("[data-wishlist-navigate]");

  if (navigateButton) {
    event.preventDefault();
    const engine = navigateButton.dataset.wishlistNavigate;
    const id = navigateButton.dataset.wishlistId;
    if (engine && id) {
      navigateToEntity(engine, id);
    }
    return;
  }
});

armorOnly.addEventListener("change", () => {
  if (armorOnly.checked) {
    accessoryOnly.checked = false;
  }

  renderEquipSlotOptions();
});

accessoryOnly.addEventListener("change", () => {
  if (accessoryOnly.checked) {
    armorOnly.checked = false;
  }

  renderEquipSlotOptions();
});

mainHandOnly.addEventListener("change", () => {
  if (mainHandOnly.checked) {
    offHandOnly.checked = false;
  }
});

offHandOnly.addEventListener("change", () => {
  if (offHandOnly.checked) {
    mainHandOnly.checked = false;
  }
});

gearSetSourceCategoryFilter.addEventListener("change", () => {
  updateGearSetSubcategoryOptions();
});

gearSetSourceSubcategoryFilter.addEventListener("change", () => {
  updateGearSetDetailOptions();
});

function bindExclusiveCheckboxPair(first, second) {
  first.addEventListener("change", () => {
    if (first.checked) {
      second.checked = false;
    }
  });

  second.addEventListener("change", () => {
    if (second.checked) {
      first.checked = false;
    }
  });
}

bindExclusiveCheckboxPair(gearSetDresserSetOnly, gearSetLooseOnly);
bindExclusiveCheckboxPair(gearSetArmoireOnly, gearSetNotArmoireOnly);
bindExclusiveCheckboxPair(gearSetHasModelLinksOnly, gearSetNoModelLinksOnly);

floatScrollUpButton.addEventListener("click", () => {
  scrollPageByAmount(-2100);
});

floatScrollDownButton.addEventListener("click", () => {
  scrollPageByAmount(2100);
});

floatScrollTopButton.addEventListener("click", () => {
  scrollPageToTop();
});

floatScrollCurrentButton.addEventListener("click", () => {
  scrollCurrentSelectionIntoView();
});

searchInput.addEventListener("keydown", event => {
  if (event.key === "Enter") {
    applyFilters();
  }
});

[
  minItemLevelInput,
  maxItemLevelInput,
  minEquipLevelInput,
  maxEquipLevelInput
].forEach(input => {
  input.addEventListener("keydown", event => {
    if (event.key === "Enter") {
      applyFilters();
    }
  });
});

function applyFilters() {
  invalidateDetailLoad();
  focusedListWindow = null;
  clearCurrentEngineSelection();
  detailBox.innerHTML = "请选择词条。";
  const rangeErrors = validateRangeInputs();

  if (rangeErrors.length > 0) {
    resultList.innerHTML = `
      <div class="empty-result">
        <p>筛选范围有误。</p>
        <p class="empty-result-tip">
          ${rangeErrors.join("；")}。
        </p>
      </div>
    `;

    activeFilters.textContent = "当前筛选：筛选范围有误";
    resultCount.textContent = "0";
    loadMoreButton.classList.add("hidden");
    return;
  }

  visibleResultCount = PAGE_SIZE;
  skipSelectedScrollOnce = true;
  renderList();
  scrollPageToTop();
  updateCurrentEngineStatePatch({
    filterState: getFilterStateFromControls(),
    visibleResultCount,
    detailHtml: getDetailHtmlForState()
  });
}

loadMoreButton.addEventListener("click", () => {
  focusedListWindow = null;
  visibleResultCount += PAGE_SIZE;
  skipSelectedScrollOnce = true;
  renderList();
  updateCurrentEngineStatePatch({
    filterState: getFilterStateFromControls(),
    visibleResultCount,
    detailHtml: getDetailHtmlForState()
  });
});

recommendedGearOnly.addEventListener("change", () => {
  if (currentEngine !== "gearPieces" && currentEngine !== "gearSets") {
    return;
  }

  focusedListWindow = null;
  visibleResultCount = PAGE_SIZE;
  skipSelectedScrollOnce = true;
  renderList();
  updateCurrentEngineStatePatch({
    filterState: getFilterStateFromControls(),
    visibleResultCount,
    detailHtml: getDetailHtmlForState()
  });
});

engineTabs.forEach(tab => {
  tab.addEventListener("click", () => {
    switchEngineTo(tab.dataset.engine || "gearPieces");
  });
});

closeImageModal.addEventListener("click", closeModal);

imageModal.addEventListener("click", event => {
  if (event.target === imageModal) {
    closeModal();
  }
});

zoomInButton.addEventListener("click", event => {
  event.stopPropagation();
  zoomInModalImage();
});

zoomOutButton.addEventListener("click", event => {
  event.stopPropagation();
  zoomOutModalImage();
});

zoomResetButton.addEventListener("click", event => {
  event.stopPropagation();
  modalZoomOrigin = "center center";
  setModalZoomByIndex(0);
});

modalImage.addEventListener("click", event => {
  event.stopPropagation();
  setZoomOriginFromClick(event);
  zoomInModalImage();
});

document.addEventListener("keydown", event => {
  if (event.key === "Escape" && !imageModal.classList.contains("hidden")) {
    closeModal();
  }
});

if (checkRequiredElements()) {
  detailPreviewObserver.observe(detailBox, {
    childList: true,
    subtree: true
  });
  renderEquipSlotOptions();
  renderWeaponTypeOptions();
  updateSourceCategoryOptionLabels();
  loadGearData();
  loadBattleContentAliasIndex();
  loadBattleCofferIndex();
  loadRecipeCraftIndex();
  loadNpcLocationIndex();
  window.setTimeout(openFirstRunNoticeModalIfNeeded, 0);
}

function showWeaponDetail(weapon) {
  refreshDetailAfterBattleCofferIndexLoads("weaponPieces", weapon.id);
  refreshDetailAfterRecipeCraftIndexLoads("weaponPieces", weapon.id);
  refreshDetailAfterNpcLocationIndexLoads("weaponPieces", weapon.id);

  const sameModelWeapons = sortSameModelItems(
    weaponItemsByModelKey[getWeaponSameModelIndexKey(weapon)] || [],
    weapon
  );

  const visibleSameModelWeapons = isSameModelExpanded
    ? sameModelWeapons
    : sameModelWeapons.slice(0, SAME_MODEL_PREVIEW_COUNT);
  const sameModelGalleryWeapons = sameModelWeapons.filter(other => {
    const images = getPreviewImages(other);
    return hasAnyPreviewImage(images.original);
  });
  const visibleSameModelGalleryWeapons = isSameModelGalleryExpanded || sameModelGalleryWeapons.length <= SAME_MODEL_GALLERY_PREVIEW_COUNT
    ? sameModelGalleryWeapons
    : sameModelGalleryWeapons.slice(0, SAME_MODEL_GALLERY_PREVIEW_COUNT);
  const hasHiddenSameModelWeapons = sameModelWeapons.length > SAME_MODEL_PREVIEW_COUNT;
  const hasHiddenSameModelGalleryWeapons = sameModelGalleryWeapons.length > SAME_MODEL_GALLERY_PREVIEW_COUNT;
  const sameModelToggleButton = hasHiddenSameModelWeapons
    ? `
      <button class="secondary-button same-model-toggle-button" onclick="toggleSameModelExpanded()">
        ${isSameModelExpanded ? "收起同模" : `展开全部同模（共 ${sameModelWeapons.length} 条）`}
      </button>
    `
    : "";
  const sameModelGalleryToggleButton = hasHiddenSameModelGalleryWeapons
    ? `
      <button class="secondary-button same-model-toggle-button" onclick="toggleSameModelGalleryExpanded()">
        ${isSameModelGalleryExpanded ? "收起同模图片" : `展开全部同模图片（共 ${sameModelGalleryWeapons.length} 件）`}
      </button>
    `
    : "";

  const comparisonRows = visibleSameModelWeapons.map(other => {
    const currentBadge = other.id === weapon.id
      ? `<span class="current-badge">当前查看</span>`
      : "";

    return `
      <tr class="${other.id === weapon.id ? "current-row" : ""}">
        <td>
          <span class="compare-name-cell">
            <img class="compare-name-icon" src="${other.icon}" alt="" loading="lazy">
            <button class="table-link" onclick="navigateToWeapon(${JSON.stringify(other.id)})">
              ${other.name}
            </button>
            <span class="compare-item-id-hint">#${other.id}</span>
          </span>
          ${currentBadge}
        </td>
        <td>${other.itemLevel}</td>
        <td>${other.equipLevel}</td>
        <td>${renderArmoireTag(other)}</td>
        <td>${renderDyeDots(other)}</td>
        <td>${renderDresserTag(other)}</td>
        <td>${renderCrestTag(other)}</td>
        <td>${getSourceText(other)}</td>
      </tr>
    `;
  }).join("");

  const sameModelGallery = visibleSameModelGalleryWeapons
    .map(other => {
      const images = getPreviewImages(other);

      if (!hasAnyPreviewImage(images.original)) {
        return "";
      }

      const isCurrent = other.id === weapon.id;
      const cardClass = [
        hasGenderSplitImage(images.original) ? "gallery-card gallery-card-wide" : "gallery-card",
        isCurrent ? "current-gallery-card" : ""
      ].join(" ");

      return `
        <div class="${cardClass}">
          ${renderPreviewBlock(images.original, other.name)}

          <div class="gallery-title">
            <button class="gallery-link" onclick="navigateToWeapon(${JSON.stringify(other.id)})">
              ${other.name}
            </button>
            ${isCurrent ? `<span class="current-badge">当前查看</span>` : ""}
          </div>

          <div class="gallery-meta">
            ${renderWeaponStructureSummary(other)} / 染色 ${yesNo(other.canDye)} / 双染 ${yesNo(other.canDualDye)}
          </div>
        </div>
      `;
    })
    .join("");

  const currentImages = getPreviewImages(weapon);
  const colorImages = [
    {
      label: "原色外观",
      image: currentImages.original
    }
  ];

  if (weapon.canDye) {
    colorImages.push({
      label: "染色区域 1 示例",
      image: currentImages.dye1
    });
  }

  if (weapon.canDualDye) {
    colorImages.push({
      label: "染色区域 2 示例",
      image: currentImages.dye2
    });
    colorImages.push({
      label: "双染整体示例",
      image: currentImages.dyeDouble
    });
  }

  if (weapon.canCrest) {
    colorImages.push({
      label: "部队徽记效果图",
      image: currentImages.crest
    });
  }

  const colorGallery = colorImages
    .filter(imageItem => hasAnyPreviewImage(imageItem.image))
    .map(imageItem => {
      return `
        <div class="gallery-card">
          ${renderPreviewBlock(imageItem.image, imageItem.label, weapon.name)}
          <div class="gallery-title">${imageItem.label}</div>
        </div>
      `;
    })
    .join("");

  detailBox.innerHTML = `
    ${renderWeaponInfoCard(weapon)}

    <div class="tag-line">
      ${renderDyeDots(weapon)}
      ${renderCrestTag(weapon)}
    </div>

    ${renderTradeTags(weapon)}
    ${renderSources(weapon)}

    <div class="section-title-row">
      <h4>同模信息横向对比</h4>
      ${sameModelToggleButton}
    </div>
    <table class="compare-table">
      <thead>
        <tr>
          <th>名称</th>
          <th>品级</th>
          <th>装备等级</th>
          <th>收藏柜</th>
          <th>染色状态</th>
          <th>投影台状态</th>
          <th>部队徽记</th>
          <th>获取方式</th>
        </tr>
      </thead>
      <tbody>
        ${comparisonRows}
      </tbody>
    </table>

    ${
      colorGallery !== ""
        ? `
          <h4>当前装备配色对比</h4>
          <div class="section-note">
            此处展示原色、染色区域、双染效果与部队徽记效果；无对应能力或图片的装备不会显示相关图片。
          </div>
          <div class="gallery-row">
            ${colorGallery}
          </div>
        `
        : ""
    }

    ${
      sameModelGallery !== ""
        ? `
          <div class="section-title-row">
            <h4>同模图片横向对比</h4>
            ${sameModelGalleryToggleButton}
          </div>
          <div class="gallery-row">
            ${sameModelGallery}
          </div>
        `
        : ""
    }
  `;
}

function makeEntityKey(engine, id) {
  return `${engine}:${String(id)}`;
}

function getGearSetListItemKey(setItem) {
  return `${setItem.engine}|${String(setItem.id)}`;
}

function registerEntity(engine, id, data) {
  if (id === null || id === undefined || id === "") {
    return;
  }

  entityRegistry[makeEntityKey(engine, id)] = {
    engine,
    id,
    data
  };
}

function addToIndexMap(indexMap, key, item) {
  if (!key) {
    return;
  }

  if (!indexMap[key]) {
    indexMap[key] = [];
  }

  indexMap[key].push(item);
}

function getGearSameModelIndexKey(item) {
  const modelKey = getModelCompareKey(item);

  if (!modelKey || !item.equipSlot) {
    return "";
  }

  return `${item.equipSlot}::${modelKey}`;
}

function getWeaponSameModelIndexKey(weapon) {
  const modelKey = getModelCompareKey(weapon);

  if (!modelKey) {
    return "";
  }

  return `${weapon.weaponType || ""}::${weapon.weaponSlot || ""}::${modelKey}`;
}

function buildEntityRegistry() {
  entityRegistry = {};
  gearItemsBySetId = {};
  gearItemsByCustomSetId = {};
  gearItemsByModelKey = {};
  weaponItemsByModelKey = {};
  _allGearSetListItems = null;
  gearSetSimilarItemsByKey = new Map();
  gearSetRecommendedKeys = new Set();
  gearSetRecommendationScoreByKey = new Map();
  gearSetArmorKeysByKey = new Map();

  items.forEach(item => {
    registerEntity("gearPieces", item.id, item);
    addToIndexMap(gearItemsByModelKey, getGearSameModelIndexKey(item), item);

    getSetIds(item).forEach(setId => {
      addToIndexMap(gearItemsBySetId, String(setId), item);
    });

    getCustomSetIds(item).forEach(customSetId => {
      addToIndexMap(gearItemsByCustomSetId, String(customSetId), item);
    });
  });

  mirageSets.forEach(setItem => {
    registerEntity("gearSets", setItem.setId, setItem);
  });

  customGearSets.forEach(customSet => {
    registerEntity("customGearSets", customSet.id, customSet);
  });

  gearSeries.forEach(seriesItem => {
    registerEntity("gearSeries", seriesItem.id, seriesItem);
  });

  weaponItems.forEach(weapon => {
    registerEntity("weaponPieces", weapon.id, weapon);
    addToIndexMap(weaponItemsByModelKey, getWeaponSameModelIndexKey(weapon), weapon);
  });

  weaponSeries.forEach(seriesItem => {
    registerEntity("weaponSeries", seriesItem.id, seriesItem);
  });

  buildGearSetRecommendationIndex();
}

function resolveEntity(route) {
  if (!route || !route.engine) {
    return null;
  }

  return entityRegistry[makeEntityKey(route.engine, route.id)] || null;
}

function getEntityData(route) {
  const entity = resolveEntity(route);

  if (!entity) {
    return null;
  }

  return entity.data;
}

if (wishlistFloatingButton) {
  wishlistFloatingButton.classList.remove("hidden");
  applyWishlistFloatingPosition(loadWishlistFloatingPosition());
  setupWishlistFloatingButtonDrag();
  updateWishlistFloatingButton();

  wishlistFloatingButton.addEventListener("click", function (event) {
    if (wishlistFloatingButton.dataset.dragMoved === "true") {
      event.preventDefault();
      return;
    }

    switchEngineTo("wishlist");
  });
}

if (appSettingsButton) {
  appSettingsButton.addEventListener("click", function () {
    openAppSettingsModal();
  });
}

if (appHelpButton) {
  appHelpButton.addEventListener("click", function () {
    openAppHelpModal();
  });
}

if (appNoticeButton) {
  appNoticeButton.addEventListener("click", function () {
    openAppNoticeModal();
  });
}
