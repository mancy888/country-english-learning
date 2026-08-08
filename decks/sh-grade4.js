/* ===================================================================
 * 词库包：上海 4 年级新版教材单词
 * 词条字段：{ en, ipa, zh, pos? }   pos ∈ v(动词) / adj(形容词) / phr(短语)
 * =================================================================== */
(function () {
  window.DECKS = window.DECKS || [];
  window.DECKS.push({
    id: 'sh-g4',
    name: '上海 4 年级',
    icon: '📚',
    tip: '按课本单元学，每次 1 个单元刚好 10 分钟。',
    groups: [
      { id: 'u1', name: 'Unit 1 居住环境', words: [
        { en:"city", ipa:"ˈsɪti", zh:"城市" },
        { en:"building", ipa:"ˈbɪldɪŋ", zh:"建筑物；楼房" },
        { en:"flat", ipa:"flæt", zh:"公寓" },
        { en:"street", ipa:"striːt", zh:"大街；街道" },
        { en:"country", ipa:"ˈkʌntri", zh:"乡村" },
        { en:"farm", ipa:"fɑːm", zh:"农场" },
        { en:"house", ipa:"haʊs", zh:"房屋；房子" },
        { en:"people", ipa:"ˈpiːpl", zh:"人；人们" },
        { en:"live", ipa:"lɪv", zh:"住；居住", pos:"v" },
        { en:"many", ipa:"ˈmeni", zh:"许多" },
        { en:"place", ipa:"pleɪs", zh:"地方" },
        { en:"quiet", ipa:"ˈkwaɪət", zh:"安静的", pos:"adj" },
        { en:"all kinds of", ipa:"ɔːl kaɪndz ɒv", zh:"各种各样的", pos:"phr" },
        { en:"a lot of", ipa:"ə lɒt ɒv", zh:"许多", pos:"phr" }
      ]},
      { id: 'u2', name: 'Unit 2 动物家园', words: [
        { en:"eagle", ipa:"ˈiːɡl", zh:"老鹰" },
        { en:"owl", ipa:"aʊl", zh:"猫头鹰" },
        { en:"honey-bee", ipa:"ˈhʌnɪbiː", zh:"蜜蜂" },
        { en:"nest", ipa:"nest", zh:"巢穴" },
        { en:"their", ipa:"ðeə(r)", zh:"他们的；她们的；它们的" },
        { en:"tree hole", ipa:"triː həʊl", zh:"树洞" },
        { en:"safe", ipa:"seɪf", zh:"安全的", pos:"adj" },
        { en:"there", ipa:"ðeə(r)", zh:"那里，在那儿" },
        { en:"snake", ipa:"sneɪk", zh:"蛇" },
        { en:"hive", ipa:"haɪv", zh:"蜂巢" },
        { en:"under", ipa:"ˈʌndə(r)", zh:"在……下面" },
        { en:"at night", ipa:"æt naɪt", zh:"在夜晚", pos:"phr" }
      ]},
      { id: 'u3', name: 'Unit 3 数字与购物基础', words: [
        { en:"plus", ipa:"plʌs", zh:"加；加号" },
        { en:"equal", ipa:"ˈiːkwəl", zh:"等于；同等" },
        { en:"minus", ipa:"ˈmaɪnəs", zh:"减；减号" },
        { en:"number", ipa:"ˈnʌmbə(r)", zh:"数字；号码" },
        { en:"use", ipa:"juːz", zh:"使用", pos:"v" },
        { en:"help", ipa:"help", zh:"帮助", pos:"v" },
        { en:"count", ipa:"kaʊnt", zh:"（按顺序）数数", pos:"v" },
        { en:"thing", ipa:"θɪŋ", zh:"东西，事物" },
        { en:"every", ipa:"ˈevri", zh:"每一个" },
        { en:"how many", ipa:"haʊ ˈmeni", zh:"（用于问句）多少", pos:"phr" }
      ]},
      { id: 'u4', name: 'Unit 4 日常购物', words: [
        { en:"supermarket", ipa:"ˈsuːpəmɑːkɪt", zh:"超市" },
        { en:"a bag of rice", ipa:"ə bæɡ ɒv raɪs", zh:"一袋米", pos:"phr" },
        { en:"a box of eggs", ipa:"ə bɒks ɒv eɡz", zh:"一盒鸡蛋", pos:"phr" },
        { en:"a bottle of juice", ipa:"ə ˈbɒtl ɒv dʒuːs", zh:"一瓶果汁", pos:"phr" },
        { en:"buy", ipa:"baɪ", zh:"购买", pos:"v" },
        { en:"sell", ipa:"sel", zh:"售卖", pos:"v" },
        { en:"shopping-list", ipa:"ˈʃɒpɪŋ lɪst", zh:"购物清单" },
        { en:"each", ipa:"iːtʃ", zh:"每个" },
        { en:"team", ipa:"tiːm", zh:"队，组" },
        { en:"faster", ipa:"ˈfɑːstə(r)", zh:"更快的", pos:"adj" },
        { en:"candy", ipa:"ˈkændi", zh:"糖果；巧克力" },
        { en:"bread", ipa:"bred", zh:"面包" },
        { en:"win", ipa:"wɪn", zh:"获胜", pos:"v" },
        { en:"still", ipa:"stɪl", zh:"还；仍然" },
        { en:"share", ipa:"ʃeə(r)", zh:"分享", pos:"v" },
        { en:"water", ipa:"ˈwɔːtə(r)", zh:"给……浇水；淡水", pos:"v" },
        { en:"how-much", ipa:"haʊ mʌtʃ", zh:"多少钱；多少", pos:"phr" },
        { en:"a bar of chocolate", ipa:"ə bɑː(r) ɒv ˈtʃɒklət", zh:"一块巧克力", pos:"phr" },
        { en:"here they are", ipa:"hɪə ðeɪ ɑː(r)", zh:"它们在这里", pos:"phr" },
        { en:"all right", ipa:"ɔːl raɪt", zh:"好的", pos:"phr" }
      ]},
      { id: 'u5', name: 'Unit 5 一年四季', words: [
        { en:"spring", ipa:"sprɪŋ", zh:"春天" },
        { en:"warm", ipa:"wɔːm", zh:"温暖的", pos:"adj" },
        { en:"summer", ipa:"ˈsʌmə(r)", zh:"夏天" },
        { en:"hot", ipa:"hɒt", zh:"炎热的", pos:"adj" },
        { en:"autumn", ipa:"ˈɔːtəm", zh:"秋天" },
        { en:"cool", ipa:"kuːl", zh:"凉爽的", pos:"adj" },
        { en:"winter", ipa:"ˈwɪntə(r)", zh:"冬天" },
        { en:"cold", ipa:"kəʊld", zh:"寒冷的", pos:"adj" },
        { en:"parent", ipa:"ˈpeərənt", zh:"父亲（或母亲）" },
        { en:"season", ipa:"ˈsiːzn", zh:"季节" },
        { en:"year", ipa:"jɪə(r)", zh:"年" },
        { en:"grow", ipa:"ɡrəʊ", zh:"（使）生长", pos:"v" },
        { en:"get", ipa:"ɡet", zh:"变得", pos:"v" },
        { en:"usually", ipa:"ˈjuːʒuəli", zh:"通常" },
        { en:"after", ipa:"ˈɑːftə(r)", zh:"在……之后" },
        { en:"fall", ipa:"fɔːl", zh:"落下", pos:"v" },
        { en:"turn", ipa:"tɜːn", zh:"（使）变成", pos:"v" },
        { en:"often", ipa:"ˈɒfn", zh:"经常" },
        { en:"snow", ipa:"snəʊ", zh:"下雪；雪", pos:"v" },
        { en:"then", ipa:"ðen", zh:"然后" }
      ]},
      { id: 'u6', name: 'Unit 6 植物', words: [
        { en:"plant", ipa:"plɑːnt", zh:"v. 种植 n. 植物", pos:"v" },
        { en:"root", ipa:"ruːt", zh:"根" },
        { en:"stem", ipa:"stem", zh:"茎" },
        { en:"leaf", ipa:"liːf", zh:"叶子（复数 leaves）" },
        { en:"flower", ipa:"ˈflaʊə(r)", zh:"花朵" },
        { en:"seed", ipa:"siːd", zh:"种子" },
        { en:"sun", ipa:"sʌn", zh:"太阳；阳光" },
        { en:"water", ipa:"ˈwɔːtə(r)", zh:"水分，浇水", pos:"v" },
        { en:"grow up", ipa:"ɡrəʊ ʌp", zh:"长大", pos:"phr" }
      ]},
      { id: 'u7', name: 'Unit 7 道路出行和安全', words: [
        { en:"road", ipa:"rəʊd", zh:"马路，公路" },
        { en:"light", ipa:"laɪt", zh:"灯光" },
        { en:"cross", ipa:"krɒs", zh:"穿过", pos:"v" },
        { en:"safe", ipa:"seɪf", zh:"安全的", pos:"adj" },
        { en:"pavement", ipa:"ˈpeɪvmənt", zh:"人行道" },
        { en:"wait", ipa:"weɪt", zh:"等待", pos:"v" },
        { en:"quickly", ipa:"ˈkwɪkli", zh:"快速地", pos:"adj" },
        { en:"slowly", ipa:"ˈsləʊli", zh:"缓慢地", pos:"adj" }
      ]},
      { id: 'u8', name: 'Unit 8 家人与祖辈', words: [
        { en:"grandparent", ipa:"ˈɡrændpeərənt", zh:"(外)祖父；(外)祖母" },
        { en:"grandpa", ipa:"ˈɡrændpɑː", zh:"爷爷、外公" },
        { en:"grandma", ipa:"ˈɡrændmɑː", zh:"奶奶、外婆" },
        { en:"visit", ipa:"ˈvɪzɪt", zh:"探望，拜访", pos:"v" },
        { en:"garden", ipa:"ˈɡɑːdn", zh:"花园" },
        { en:"cook", ipa:"kʊk", zh:"烹饪、做饭", pos:"v" },
        { en:"chat", ipa:"tʃæt", zh:"闲谈，聊天", pos:"v" }
      ]},
      { id: 'num', name: '数字 几十几', words: [
        { en:"twenty-one", ipa:"ˈtwenti wʌn", zh:"二十一" },
        { en:"twenty-two", ipa:"ˈtwenti tuː", zh:"二十二" },
        { en:"twenty-three", ipa:"ˈtwenti θriː", zh:"二十三" },
        { en:"twenty-four", ipa:"ˈtwenti fɔː(r)", zh:"二十四" },
        { en:"twenty-five", ipa:"ˈtwenti faɪv", zh:"二十五" },
        { en:"twenty-six", ipa:"ˈtwenti sɪks", zh:"二十六" },
        { en:"twenty-seven", ipa:"ˈtwenti ˈsevn", zh:"二十七" },
        { en:"twenty-eight", ipa:"ˈtwenti eɪt", zh:"二十八" },
        { en:"twenty-nine", ipa:"ˈtwenti naɪn", zh:"二十九" },
        { en:"thirty", ipa:"ˈθɜːti", zh:"三十" },
        { en:"forty", ipa:"ˈfɔːti", zh:"四十" },
        { en:"fifty", ipa:"ˈfɪfti", zh:"五十" },
        { en:"sixty", ipa:"ˈsɪksti", zh:"六十" },
        { en:"seventy", ipa:"ˈsevnti", zh:"七十" },
        { en:"eighty", ipa:"ˈeɪti", zh:"八十" },
        { en:"ninety", ipa:"ˈnaɪnti", zh:"九十" },
        { en:"one-hundred", ipa:"ˌwʌn ˈhʌndrəd", zh:"一百" }
      ]},
      { id: 'week', name: '星期', words: [
        { en:"Monday", ipa:"ˈmʌndeɪ", zh:"周一" },
        { en:"Tuesday", ipa:"ˈtjuːzdeɪ", zh:"周二" },
        { en:"Wednesday", ipa:"ˈwenzdeɪ", zh:"周三" },
        { en:"Thursday", ipa:"ˈθɜːzdeɪ", zh:"周四" },
        { en:"Friday", ipa:"ˈfraɪdeɪ", zh:"周五" },
        { en:"Saturday", ipa:"ˈsætədeɪ", zh:"周六" },
        { en:"Sunday", ipa:"ˈsʌndeɪ", zh:"周日" }
      ]}
    ]
  });
})();
