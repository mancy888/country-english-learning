/* ===================================================================
 * 词库包：上海教育出版社 牛津上海版（五四学制初中）六年级上册
 * 2026 现行课本标准版词汇，按单元整理；词条字段：
 *   { en, ipa, zh, pos? }   pos ∈ v(动词) / adj(形容词) / phr(短语)
 * 注：名词、副词等不标 pos；多词性词条按课本主词性标注。
 * =================================================================== */
(function () {
  window.DECKS = window.DECKS || [];
  window.DECKS.push({
    id: 'sh-g6',
    name: '上海 6 年级',
    icon: '📗',
    tip: '牛津上海版（五四学制）六年级上册 12 单元 + 拓展短语，每次 1 单元约 10 分钟。',
    groups: [
      { id: 'u1', name: 'Unit 1 成长 Growing up', words: [
        { en:"junior high school", ipa:"ˈdʒuːniə haɪ skuːl", zh:"初级中学", pos:"phr" },
        { en:"be born", ipa:"biː bɔːn", zh:"出生", pos:"phr" },
        { en:"grow up", ipa:"ɡrəʊ ʌp", zh:"长大；成长", pos:"phr" },
        { en:"month", ipa:"mʌnθ", zh:"月份" },
        { en:"cute", ipa:"kjuːt", zh:"可爱的", pos:"adj" },
        { en:"pretty", ipa:"ˈprɪti", zh:"漂亮的", pos:"adj" },
        { en:"handsome", ipa:"ˈhænsəm", zh:"（男生）英俊的", pos:"adj" },
        { en:"turtle", ipa:"ˈtɜːtl", zh:"乌龟" },
        { en:"catch", ipa:"kætʃ", zh:"抓住；捉住", pos:"v" },
        { en:"fly", ipa:"flaɪ", zh:"苍蝇（名词）/ 飞翔（动词）", pos:"v" },
        { en:"ago", ipa:"əˈɡəʊ", zh:"……以前" },
        { en:"photo", ipa:"ˈfəʊtəʊ", zh:"照片" },
        { en:"weigh", ipa:"weɪ", zh:"称重量；重量为", pos:"v" },
        { en:"height", ipa:"haɪt", zh:"身高；高度" }
      ]},
      { id: 'u2', name: 'Unit 2 我的暑假 My summer holiday', words: [
        { en:"famous", ipa:"ˈfeɪməs", zh:"著名的", pos:"adj" },
        { en:"during", ipa:"ˈdjʊərɪŋ", zh:"在……期间" },
        { en:"spend", ipa:"spend", zh:"度过；花费", pos:"v" },
        { en:"everyone", ipa:"ˈevriwʌn", zh:"所有人" },
        { en:"countryside", ipa:"ˈkʌntrisaɪd", zh:"乡下；郊外" },
        { en:"pick", ipa:"pɪk", zh:"采摘", pos:"v" },
        { en:"camp", ipa:"kæmp", zh:"露营；营地", pos:"v" },
        { en:"swim", ipa:"swɪm", zh:"游泳", pos:"v" },
        { en:"trip", ipa:"trɪp", zh:"短途旅行" },
        { en:"visit", ipa:"ˈvɪzɪt", zh:"游览；拜访", pos:"v" },
        { en:"summer camp", ipa:"ˈsʌmə kæmp", zh:"夏令营", pos:"phr" }
      ]},
      { id: 'u3', name: 'Unit 3 健康与否 Healthy or unhealthy', words: [
        { en:"healthy", ipa:"ˈhelθi", zh:"健康的", pos:"adj" },
        { en:"unhealthy", ipa:"ʌnˈhelθi", zh:"不健康的", pos:"adj" },
        { en:"hamburger", ipa:"ˈhæmbɜːɡə(r)", zh:"汉堡包" },
        { en:"cola", ipa:"ˈkəʊlə", zh:"可乐" },
        { en:"fruit", ipa:"fruːt", zh:"水果" },
        { en:"pie", ipa:"paɪ", zh:"馅饼" },
        { en:"pizza", ipa:"ˈpiːtsə", zh:"披萨" },
        { en:"vegetable", ipa:"ˈvedʒtəbl", zh:"蔬菜" },
        { en:"cereal", ipa:"ˈsɪəriəl", zh:"谷物；麦片" },
        { en:"sausage", ipa:"ˈsɒsɪdʒ", zh:"香肠" },
        { en:"snack", ipa:"snæk", zh:"零食；点心" },
        { en:"plenty of", ipa:"ˈplenti ɒv", zh:"大量", pos:"phr" },
        { en:"a little", ipa:"ə ˈlɪtl", zh:"少量", pos:"phr" }
      ]},
      { id: 'u4', name: 'Unit 4 我们的邻居 Our neighbours', words: [
        { en:"neighbour", ipa:"ˈneɪbə(r)", zh:"邻居" },
        { en:"community", ipa:"kəˈmjuːnəti", zh:"社区" },
        { en:"flat", ipa:"flæt", zh:"公寓套房" },
        { en:"estate", ipa:"ɪˈsteɪt", zh:"住宅小区" },
        { en:"help", ipa:"help", zh:"帮助", pos:"v" },
        { en:"helpful", ipa:"ˈhelpfl", zh:"乐于助人的", pos:"adj" },
        { en:"volunteer", ipa:"ˌvɒlənˈtɪə(r)", zh:"志愿者" },
        { en:"fix", ipa:"fɪks", zh:"修理", pos:"v" },
        { en:"broken", ipa:"ˈbrəʊkən", zh:"坏掉的", pos:"adj" },
        { en:"share", ipa:"ʃeə(r)", zh:"分享", pos:"v" },
        { en:"friendly", ipa:"ˈfrendli", zh:"友善的", pos:"adj" },
        { en:"from time to time", ipa:"frəm taɪm tu taɪm", zh:"时不时；偶尔", pos:"phr" }
      ]},
      { id: 'u5', name: 'Unit 5 濒危动物 Animals in danger', words: [
        { en:"wild", ipa:"waɪld", zh:"野生的（adj.）/ 野外（n.）", pos:"adj" },
        { en:"die", ipa:"daɪ", zh:"死亡", pos:"v" },
        { en:"rhino", ipa:"ˈraɪnəʊ", zh:"犀牛" },
        { en:"South China tiger", ipa:"saʊθ tʃaɪnə ˈtaɪɡə(r)", zh:"华南虎", pos:"phr" },
        { en:"blue whale", ipa:"bluː weɪl", zh:"蓝鲸", pos:"phr" },
        { en:"in danger", ipa:"ɪn ˈdeɪndʒə(r)", zh:"处于危险之中", pos:"phr" },
        { en:"protect", ipa:"prəˈtekt", zh:"保护", pos:"v" },
        { en:"forest", ipa:"ˈfɒrɪst", zh:"森林" },
        { en:"hunt", ipa:"hʌnt", zh:"捕猎", pos:"v" },
        { en:"safe", ipa:"seɪf", zh:"安全的", pos:"adj" },
        { en:"thousand", ipa:"ˈθaʊznd", zh:"一千" },
        { en:"hundred", ipa:"ˈhʌndrəd", zh:"一百" }
      ]},
      { id: 'u6', name: 'Unit 6 网友 E-friends', words: [
        { en:"e-friend", ipa:"ˈiː frend", zh:"网友" },
        { en:"country", ipa:"ˈkʌntri", zh:"国家；乡村" },
        { en:"hobby", ipa:"ˈhɒbi", zh:"爱好" },
        { en:"favourite", ipa:"ˈfeɪvərɪt", zh:"最喜欢的", pos:"adj" },
        { en:"subject", ipa:"ˈsʌbdʒɪkt", zh:"学科" },
        { en:"language", ipa:"ˈlæŋɡwɪdʒ", zh:"语言" },
        { en:"reply", ipa:"rɪˈplaɪ", zh:"回复", pos:"v" },
        { en:"message", ipa:"ˈmesɪdʒ", zh:"讯息；消息" },
        { en:"keep in touch", ipa:"kiːp ɪn tʌtʃ", zh:"保持联系", pos:"phr" },
        { en:"address", ipa:"əˈdres", zh:"地址" }
      ]},
      { id: 'u7', name: 'Unit 7 看电影 Seeing a film', words: [
        { en:"cinema", ipa:"ˈsɪnəmə", zh:"电影院" },
        { en:"film", ipa:"fɪlm", zh:"电影（n.）/ 拍摄（v.）", pos:"v" },
        { en:"shall", ipa:"ʃæl", zh:"（提建议）要不要" },
        { en:"cartoon", ipa:"kɑːˈtuːn", zh:"卡通片" },
        { en:"adventure", ipa:"ədˈventʃə(r)", zh:"冒险" },
        { en:"exciting", ipa:"ɪkˈsaɪtɪŋ", zh:"令人激动的", pos:"adj" },
        { en:"funny", ipa:"ˈfʌni", zh:"滑稽好笑的", pos:"adj" },
        { en:"ticket", ipa:"ˈtɪkɪt", zh:"电影票" },
        { en:"price", ipa:"praɪs", zh:"价格" },
        { en:"popcorn", ipa:"ˈpɒpkɔːn", zh:"爆米花" }
      ]},
      { id: 'u8', name: 'Unit 8 参观博物馆 Visiting museums', words: [
        { en:"museum", ipa:"mjuˈziːəm", zh:"博物馆" },
        { en:"exhibit", ipa:"ɪɡˈzɪbɪt", zh:"展品" },
        { en:"history", ipa:"ˈhɪstri", zh:"历史" },
        { en:"art", ipa:"ɑːt", zh:"美术；艺术" },
        { en:"science", ipa:"ˈsaɪəns", zh:"科学" },
        { en:"robot", ipa:"ˈrəʊbɒt", zh:"机器人" },
        { en:"invent", ipa:"ɪnˈvent", zh:"发明", pos:"v" },
        { en:"invention", ipa:"ɪnˈvenʃn", zh:"发明物" },
        { en:"ancient", ipa:"ˈeɪnʃənt", zh:"古老的", pos:"adj" },
        { en:"learn about", ipa:"lɜːn əˈbaʊt", zh:"了解", pos:"phr" }
      ]},
      { id: 'u9', name: 'Unit 9 世界名城 Great cities of the world', words: [
        { en:"capital", ipa:"ˈkæpɪtl", zh:"首都" },
        { en:"tourist", ipa:"ˈtʊərɪst", zh:"游客" },
        { en:"famous landmark", ipa:"ˈfeɪməs ˈlændmɑːk", zh:"地标建筑", pos:"phr" },
        { en:"harbour", ipa:"ˈhɑːbə(r)", zh:"海港" },
        { en:"street", ipa:"striːt", zh:"街道" },
        { en:"busy", ipa:"ˈbɪzi", zh:"繁忙的", pos:"adj" },
        { en:"hotel", ipa:"həʊˈtel", zh:"酒店" },
        { en:"palace", ipa:"ˈpæləs", zh:"宫殿" },
        { en:"travel", ipa:"ˈtrævl", zh:"旅行", pos:"v" },
        { en:"worldwide", ipa:"ˈwɜːldwaɪd", zh:"世界各地的", pos:"adj" }
      ]},
      { id: 'u10', name: 'Unit 10 空气 Air', words: [
        { en:"air", ipa:"eə(r)", zh:"空气" },
        { en:"breathe", ipa:"briːð", zh:"呼吸", pos:"v" },
        { en:"fresh", ipa:"freʃ", zh:"新鲜的", pos:"adj" },
        { en:"dirty", ipa:"ˈdɜːti", zh:"肮脏的", pos:"adj" },
        { en:"smoke", ipa:"sməʊk", zh:"烟雾（n.）/ 抽烟（v.）", pos:"v" },
        { en:"factory", ipa:"ˈfæktri", zh:"工厂" },
        { en:"pollute", ipa:"pəˈluːt", zh:"污染", pos:"v" },
        { en:"pollution", ipa:"pəˈluːʃn", zh:"污染物；污染" },
        { en:"clean", ipa:"kliːn", zh:"干净的（adj.）/ 清扫（v.）", pos:"v" },
        { en:"keep alive", ipa:"kiːp əˈlaɪv", zh:"维持（……的）生命", pos:"phr" }
      ]},
      { id: 'u11', name: 'Unit 11 树木 Trees', words: [
        { en:"root", ipa:"ruːt", zh:"树根" },
        { en:"trunk", ipa:"trʌŋk", zh:"树干" },
        { en:"branch", ipa:"brɑːntʃ", zh:"树枝" },
        { en:"leaf", ipa:"liːf", zh:"树叶（复数 leaves）" },
        { en:"wood", ipa:"wʊd", zh:"木头；木材" },
        { en:"furniture", ipa:"ˈfɜːnɪtʃə(r)", zh:"家具" },
        { en:"oxygen", ipa:"ˈɒksɪdʒən", zh:"氧气" },
        { en:"shade", ipa:"ʃeɪd", zh:"树荫；阴凉处" },
        { en:"cut down", ipa:"kʌt daʊn", zh:"砍伐", pos:"phr" },
        { en:"plant trees", ipa:"plɑːnt triːz", zh:"种树", pos:"phr" }
      ]},
      { id: 'u12', name: 'Unit 12 地球 The Earth', words: [
        { en:"Earth", ipa:"ɜːθ", zh:"地球" },
        { en:"ocean", ipa:"ˈəʊʃn", zh:"海洋" },
        { en:"land", ipa:"lænd", zh:"陆地" },
        { en:"river", ipa:"ˈrɪvə(r)", zh:"河流" },
        { en:"mountain", ipa:"ˈmaʊntən", zh:"高山" },
        { en:"environment", ipa:"ɪnˈvaɪrənmənt", zh:"环境" },
        { en:"rubbish", ipa:"ˈrʌbɪʃ", zh:"垃圾" },
        { en:"recycle", ipa:"ˌriːˈsaɪkl", zh:"回收利用", pos:"v" },
        { en:"waste", ipa:"weɪst", zh:"废弃物（n.）/ 浪费（v.）", pos:"v" },
        { en:"protect the Earth", ipa:"prəˈtekt ði ɜːθ", zh:"保护地球", pos:"phr" }
      ]},
      { id: 'phr', name: '拓展必备短语（全册）', words: [
        { en:"go-cycling", ipa:"ɡəʊ ˈsaɪklɪŋ", zh:"骑行", pos:"phr" },
        { en:"go-ice-skating", ipa:"ɡəʊ ˈaɪs skeɪtɪŋ", zh:"滑冰", pos:"phr" },
        { en:"throw snowballs", ipa:"θrəʊ ˈsnəʊbɔːlz", zh:"扔雪球", pos:"phr" },
        { en:"raise-money", ipa:"reɪz ˈmʌni", zh:"筹款", pos:"phr" },
        { en:"ink-painting", ipa:"ɪŋk ˈpeɪntɪŋ", zh:"水墨画", pos:"phr" },
        { en:"oil-painting", ipa:"ɔɪl ˈpeɪntɪŋ", zh:"油画", pos:"phr" }
      ]}
    ]
  });
})();
