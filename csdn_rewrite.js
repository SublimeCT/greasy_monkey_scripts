// ==UserScript==
// @name         CSDN 去广告沉浸阅读模式
// @namespace    http://tampermonkey.net/
// @version      2.1
// @description  加入随机背景图片(点击右下角小齿轮), 净化剪切板; 移除页面内广告和底部列表中的下载链接, 建议使用 ABP 屏蔽广告!!!; 清理 CSDN 底部提示栏及广告并直接展开内容
// @description  背景图片取自 https://www.baidu.com/home/skin/data/skin
// @icon         https://avatar.csdn.net/D/7/F/3_nevergk.jpg
// @author       sven
// @note         v1.8  移除点击文章中的链接拦截, 直接跳转到目标链接, 建议使用鼠标中键在新窗口打开链接!; 更新右侧 toolkit 按钮组的屏蔽规则
// @note         v1.9  解除跳转拦截; 增加新的广告过滤规则
// @note         v1.10 增加 ask.csdn.net 支持
// @note         v1.11 更新 bbs.csdn.net 过滤规则; 增加底部 "底线" 描述
// @note         v2.0  增加背景图设置入口按钮, 扩展 bottom tool bar
// @note         v2.1  修改脚本加载时机, 不会再出现先加载广告后屏蔽的情况了
// @match        *://blog.csdn.net/*/article/details/*
// @match        *://*.blog.csdn.net/article/details/*
// @include      https://bbs.csdn.net/topics/*
// @include      https://*.iteye.com/blog/*
// @include      https://*.iteye.com/news/*
// @include      https://ask.csdn.net/questions/*
// @run-at       document-start
// @match        <$URL$>
// ==/UserScript==

(function() {
    'use strict';
    (() => {
        // 爬到的所有现在可访问的背景图ID
        // const IMG_ID_LIST = [ 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 58, 59, 60, 61, 62, 63, 64, 65, 66, 67, 68, 69, 70, 71, 72, 73, 74, 75, 76, 77, 78, 79, 80, 81, 82, 83, 84, 85, 86, 87, 88, 89, 90, 91, 92, 93, 94, 95, 96, 97, 98, 99, 100, 101, 102, 103, 104, 105, 106, 107, 108, 109, 110, 111, 112, 113, 114, 115, 116, 117, 118, 119, 120, 121, 122, 123, 124, 125, 126, 127, 128, 129, 130, 131, 132, 133, 134, 135, 136, 137, 138, 139, 140, 141, 142, 143, 144, 145, 146, 147, 148, 149, 150, 151, 152, 153, 154, 155, 156, 157, 158, 159, 160, 161, 162, 163, 164, 165, 166, 167, 168, 169, 170, 171, 172, 173, 174, 175, 176, 177, 178, 179, 180, 181, 182, 183, 184, 185, 186, 200, 201, 202, 203, 204, 205, 206, 207, 208, 209, 210, 211, 212, 213, 214, 215, 216, 217, 218, 219, 220, 221, 222, 223, 224, 225, 226, 227, 228, 229, 230, 231, 232, 233, 234, 235, 236, 237, 238, 239, 240, 241, 242, 243, 244, 245, 246, 247, 248, 249, 250, 251, 252, 253, 254, 255, 256, 257, 258, 259, 260, 261, 262, 263, 264, 265, 266, 267, 268, 269, 270, 271, 272, 273, 274, 275, 276, 277, 278, 279, 280, 281, 282, 283, 284, 285, 286, 287, 288, 289, 290, 291, 292, 293, 294, 295, 296, 297, 298, 299, 300, 301, 302, 303, 304, 305, 306, 307, 308, 309, 310, 311, 312, 313, 314, 315, 316, 317, 318, 319, 320, 321, 322, 323, 324, 325, 326, 327, 328, 329, 330, 331, 400, 401, 402, 403, 404, 405, 406, 407, 408, 409, 410, 411, 412, 413, 414, 415, 416, 417, 418, 419, 420, 421, 422, 423, 424, 425, 426, 427, 428, 429, 430, 431, 432, 433, 434, 435, 436, 437, 438, 439, 440, 441, 442, 443, 444, 445, 446, 447, 448, 449, 450, 451, 452, 453, 454, 455, 456, 457, 458, 459, 460, 461, 462, 463, 464, 465, 466, 467, 468, 469, 470, 471, 472, 473, 474, 475, 476, 477, 478, 479, 480, 481, 482, 483, 484, 485, 486, 487, 488, 489, 490, 491, 492, 493, 494, 495, 496, 497, 498, 499, 500, 501, 502, 503, 504, 505, 506, 507, 508, 509, 510, 511, 512, 513, 514, 515, 516, 517, 518, 519, 520, 521, 522, 523, 524, 525, 526, 527, 528, 529, 530, 531, 532, 533, 534, 535, 536, 537, 538, 539, 540, 541, 542, 543, 544, 608, 609, 610, 611, 620, 621, 622, 623, 624, 625, 626, 627, 628, 629, 630, 631, 632, 633, 634, 635, 636, 637, 638, 639, 640, 641, 642, 643, 644, 645, 646, 647, 648, 649, 650, 651, 652, 653, 654, 655, 656, 657, 658, 659, 660, 661, 662, 663, 664, 665, 666, 667, 668, 669, 670, 671, 672, 673, 674, 675, 676, 677, 678, 679, 680, 681, 682, 683, 684, 685, 686, 687, 688, 689, 690, 691, 692, 693, 694, 695, 696, 697, 698, 699, 700, 701, 702, 703, 704, 705, 706, 707, 708, 709, 710, 711, 712, 713, 714, 715, 716, 717, 718, 719, 720, 721, 722, 723, 724, 725, 726, 727, 728, 729, 730, 731, 732, 733, 734, 735, 736, 737, 738, 739, 740, 741, 742, 743, 744, 745, 746, 747, 748, 749, 750, 751, 752, 753, 754, 755, 756, 757, 758, 759, 760, 761, 762, 763, 764, 765, 766, 767, 768, 769, 770, 771, 772, 773, 774, 775, 776, 777, 778, 779, 780, 781, 782, 783, 784, 785, 786, 787, 788, 789, 790, 791, 792, 793, 794, 795, 796, 797, 798, 799, 800, 801, 802, 803, 804, 805, 806, 807, 808, 809, 810, 811, 812, 813, 814, 815, 816, 817, 818, 819, 820, 821, 822, 823, 824, 825, 826, 827, 828, 829, 830, 831, 832, 833, 834, 835, 836, 837, 838, 839, 840, 841, 842, 843, 844, 845, 846, 847, 848, 849, 850, 851, 852, 853, 854, 855, 856, 857, 858, 859, 860, 861, 862, 863, 864, 865, 866, 867, 868, 869, 870, 871, 872, 873, 874, 875, 876, 877, 878, 879, 880, 881, 882, 883, 884, 885, 886, 887, ]
        const IMG_CATEGORYS = {"热门":[887,886,883,882,881,880,879,878,877,876,874,875,872,873,859,832,833,834,827,828,829,830,831,817,818,819,820,821,805,806,807,808,809,810,811,812,813,814,815,816,796,797,798,799,800,801,802,803,804,776,777,778,781,784,765,767,768,766,611,610,608,720],"冒险岛2":[860,861,862,863,864,865,866,867,868,869,870,871],"守望先锋":[835,836,837,838,839,840,841,842,843,844,845,846],"魔兽世界":[721,722,723,724,725,726,727,728,729,730,731,732],"炉石传说":[733,734,735,736,737,738,739,740,741,742,743,744],"风暴英雄":[660,661,662,663,664,665,666,667,668,669,670,671],"暗黑破坏神Ⅲ":[672,673,674,675,676,677,678,679,680,681,682,683],"星际争霸II":[684,685,686,687,688,689,690,691,692,693,694,695],"冷兔":[749,750,751,752,753,754,755,756,757,758,759,760],"阿狸":[521,114,523,524,525,526,527,528,529,530,531,532],"炮炮兵":[540,534,535,536,537,538,539,533,541,542,543,544],"林心如":[437,438,440,439,441,443,447,444,445,446,442,448],"郑爽":[509,510,511,512,515,514,513,516,517,518,519,520],"戚薇":[449,456,451,452,453,454,455,450,457,459,458,460],"佟丽娅":[485,486,490,488,489,487,491,492,493,494,495,496],"Angelababy":[400,401,402,403,407,405,406,410,404,409,408,411],"唐嫣":[473,474,475,482,480,478,479,477,476,481,483,484],"李冰冰":[424,425,427,430,426,429,428,431,432,433,434,435],"高圆圆":[412,413,418,415,416,417,414,419,420,421,422,423],"孙俪":[461,462,463,464,471,466,468,467,469,470,465,472],"姚晨":[497,498,499,506,502,501,503,504,505,507,500,508],"杨幂":[200,201,202,203,204,205,206,207,208,209,210,211],"刘诗诗":[273,274,275,276,277,278,279,280,281,282,283],"胡歌":[260,261,262,263,628,629,630,631,268,269,270,271],"邓紫棋":[320,321,322,323,324,325,326,327,328,329,330,331],"赵丽颖":[249,2481,250,251,252,253,254,255,256,257,258,259],"马天宇":[284,285,286,287,288,289,290,291,292,293,294,295],"陈晓":[233,225,226,227,228,229,230,231,232,224,234,235],"陈伟霆":[308,309,310,311,312,313,314,315,316,317,318,319],"柳岩":[236,2371,238,239,240,241,242,243,244,245,246,247],"吴奇隆":[297,298,299,300,301,302,304,296,305,306,307],"风景":[822,823,824,825,826,54,62,5,37,115,116,117,118,120,122,123,49,25,121,26,43,45,48,51,70,4,10,11,17,23,6,28,38,16,31,42,163,164,165,166,167,168,170,171,172,174,175,177,178,179,180,181,182,184,185,186,69,57,13,67],"简约":[12,111,114,53,27,33,41,35,2,14,44,21,36,8,150,125,1,169,173,176,183,46,61,47,52,64,24,58,18,59,55,9,20],"小清新":[74,71,113,119,124,29,65,32,34,39,40,50,60,73,30,63,126,128,66,19,112,22,68,7,15,3,56],"最近使用":[128,241,238,242,243,21,776,30,834,829,125,823,816,822,5,54,12,611]}
        const IMG_MAP = {"1":"原野 全景图片","2":"银汉迢迢 全景图片","3":"紫色郁金香 百度相册","4":"飞瀑如练 全景图片","5":"梦里水乡 探摄小子","6":"长天一色 全景图片","7":"春意浓 sprint207","8":"暮色四合 探摄小子","9":"出水芙蓉 探摄小子","10":"壁立千仞 全景图片","11":"廊桥遗梦 探摄小子","12":"寥落星河 全景图片","13":"层林尽染 全景图片","14":"晨曦 探摄小子","15":"早梅争春 探摄小子","16":"千山雪 刘霄","17":"海之梦 全景图片","18":"白色飞羽 sprint207","19":"在路上 jesse2young","20":"锦鲤 sprint207","21":"雨夜 yunxiaoqian","22":"水墨江南 戈斯拉918","23":"城市之光 戈斯拉918","24":"三叶草 wanzathe","25":" 全景图片","26":" 全景图片","27":" 全景图片","28":" 全景图片","29":" 全景图片","30":" 全景图片","31":" 全景图片","32":" 全景图片","33":" 全景图片","34":" 全景图片","35":" 全景图片","36":" 全景图片","37":" 全景图片","38":" 全景图片","39":" 全景图片","40":" 全景图片","41":" 全景图片","42":" 全景图片","43":" 全景图片","44":" 全景图片","45":" 全景图片","46":" 全景图片","47":" 全景图片","48":" 全景图片","49":" 全景图片","50":" 全景图片","51":" 全景图片","52":" 全景图片","53":" ranklau","54":" silsnow","55":" weifengqingyu","56":" 张云洁01","57":" tiffanywangbei","58":" ying_ok_delang","59":" sherry_dundun","60":" 源形毕露","61":" 路璐","62":" richard-wang","63":" 源形毕露","64":" 圣名若瑟","65":" 米壹映画","66":" 米壹映画","67":" 路璐","68":" 路璐","69":" 毛嘉文","70":" richard-wang","71":" fish,胡子鱼","73":" fish,胡子鱼","74":" fish,胡子鱼","111":" 全景图片","112":" fish，胡子鱼","113":" fish，胡子鱼","114":" 全景图片","115":" 彼岸Claire","116":" 落绪纷飞","117":" 魔神咒","118":" lemonchen07","119":" 决明","120":" 长老亮","121":" 蓝月玩转西部","122":" 小pie","123":" woodfishbbi","124":" 早川","125":"波涛汹涌 全景","126":"火车飞驰 全景","128":"演唱会 全景","150":"激情世界杯 ","163":" shenmishashou","164":" 我叫孟夕","165":" 穷游晓明","166":" 1024小虎牙","167":" shenmishashou","168":" shenmishashou","169":" 0535xiaoyudi","170":" 穷游晓明","171":" 西西里玩不停","172":" 西西里玩不停","173":" 1024小虎牙","174":" shenmishashou","175":" 穷游晓明","176":" 1024小虎牙","177":" 我叫孟夕","178":" 1024小虎牙","179":" shenmishashou","180":" 西西里玩不停","181":" 我叫孟夕","182":" 蓝色呓语","183":" 西西里玩不停","184":" 西西里玩不停","185":" 我叫孟夕","186":" 西西里玩不停","200":"杨幂0","201":"杨幂1","202":"杨幂2","203":"杨幂3","204":"杨幂4","205":"杨幂5","206":"杨幂6","207":"杨幂7","208":"杨幂8","209":"杨幂9","210":"杨幂10","211":"杨幂11","224":"陈晓9","225":"陈晓1","226":"陈晓2","227":"陈晓3","228":"陈晓4","229":"陈晓5","230":"陈晓6","231":"陈晓7","232":"陈晓8","233":"陈晓0","234":"陈晓10","235":"陈晓11","236":"柳岩0","238":"最近使用2","239":"柳岩3","240":"柳岩4","241":"最近使用1","242":"最近使用3","243":"最近使用4","244":"柳岩8","245":"柳岩9","246":"柳岩10","247":"柳岩11","249":"赵丽颖0","250":"赵丽颖2","251":"赵丽颖3","252":"赵丽颖4","253":"赵丽颖5","254":"赵丽颖6","255":"赵丽颖7","256":"赵丽颖8","257":"赵丽颖9","258":"赵丽颖10","259":"赵丽颖11","260":"胡歌0","261":"胡歌1","262":"胡歌2","263":"胡歌3","268":"胡歌8","269":"胡歌9","270":"胡歌10","271":"胡歌11","273":"刘诗诗0","274":"刘诗诗1","275":"刘诗诗2","276":"刘诗诗3","277":"刘诗诗4","278":"刘诗诗5","279":"刘诗诗6","280":"刘诗诗7","281":"刘诗诗8","282":"刘诗诗9","283":"刘诗诗10","284":"马天宇0","285":"马天宇1","286":"马天宇2","287":"马天宇3","288":"马天宇4","289":"马天宇5","290":"马天宇6","291":"马天宇7","292":"马天宇8","293":"马天宇9","294":"马天宇10","295":"马天宇11","296":"吴奇隆7","297":"吴奇隆0","298":"吴奇隆1","299":"吴奇隆2","300":"吴奇隆3","301":"吴奇隆4","302":"吴奇隆5","304":"吴奇隆6","305":"吴奇隆8","306":"吴奇隆9","307":"吴奇隆10","308":"陈伟霆0","309":"陈伟霆1","310":"陈伟霆2","311":"陈伟霆3","312":"陈伟霆4","313":"陈伟霆5","314":"陈伟霆6","315":"陈伟霆7","316":"陈伟霆8","317":"陈伟霆9","318":"陈伟霆10","319":"陈伟霆11","320":"邓紫棋0","321":"邓紫棋1","322":"邓紫棋2","323":"邓紫棋3","324":"邓紫棋4","325":"邓紫棋5","326":"邓紫棋6","327":"邓紫棋7","328":"邓紫棋8","329":"邓紫棋9","330":"邓紫棋10","331":"邓紫棋11","400":"Angelababy0","401":"Angelababy1","402":"Angelababy2","403":"Angelababy3","404":"Angelababy8","405":"Angelababy5","406":"Angelababy6","407":"Angelababy4","408":"Angelababy10","409":"Angelababy9","410":"Angelababy7","411":"Angelababy11","412":"高圆圆0","413":"高圆圆1","414":"高圆圆6","415":"高圆圆3","416":"高圆圆4","417":"高圆圆5","418":"高圆圆2","419":"高圆圆7","420":"高圆圆8","421":"高圆圆9","422":"高圆圆10","423":"高圆圆11","424":"李冰冰0","425":"李冰冰1","426":"李冰冰4","427":"李冰冰2","428":"李冰冰6","429":"李冰冰5","430":"李冰冰3","431":"李冰冰7","432":"李冰冰8","433":"李冰冰9","434":"李冰冰10","435":"李冰冰11","437":"林心如0","438":"林心如1","439":"林心如3","440":"林心如2","441":"林心如4","442":"林心如10","443":"林心如5","444":"林心如7","445":"林心如8","446":"林心如9","447":"林心如6","448":"林心如11","449":"戚薇0","450":"戚薇7","451":"戚薇2","452":"戚薇3","453":"戚薇4","454":"戚薇5","455":"戚薇6","456":"戚薇1","457":"戚薇8","458":"戚薇10","459":"戚薇9","460":"戚薇11","461":" 陈漫","462":"孙俪1","463":"孙俪2","464":"孙俪3","465":"孙俪10","466":"孙俪5","467":"孙俪7","468":" 陈漫","469":" 陈漫","470":"孙俪9","471":"孙俪4","472":"孙俪11","473":"唐嫣0","474":"唐嫣1","475":"唐嫣2","476":"唐嫣8","477":"唐嫣7","478":"唐嫣5","479":"唐嫣6","480":"唐嫣4","481":"唐嫣9","482":"唐嫣3","483":"唐嫣10","484":"唐嫣11","485":"佟丽娅0","486":"佟丽娅1","487":"佟丽娅5","488":"佟丽娅3","489":"佟丽娅4","490":"佟丽娅2","491":"佟丽娅6","492":"佟丽娅7","493":"佟丽娅8","494":"佟丽娅9","495":"佟丽娅10","496":"佟丽娅11","497":"姚晨0","498":"姚晨1","499":"姚晨2","500":"姚晨10","501":"姚晨5","502":"姚晨4","503":"姚晨6","504":"姚晨7","505":"姚晨8","506":"姚晨3","507":"姚晨9","508":"姚晨11","509":"郑爽0","510":"郑爽1","511":"郑爽2","512":"郑爽3","513":"郑爽6","514":"郑爽5","515":"郑爽4","516":"郑爽7","517":"郑爽8","518":"郑爽9","519":"郑爽10","520":"郑爽11","521":"阿狸0","523":"阿狸2","524":"阿狸3","525":"阿狸4","526":"阿狸5","527":"阿狸6","528":"阿狸7","529":"阿狸8","530":"阿狸9","531":"阿狸10","532":"阿狸11","533":"炮炮兵7","534":"炮炮兵1","535":"炮炮兵2","536":"炮炮兵3","537":"炮炮兵4","538":"炮炮兵5","539":"炮炮兵6","540":"炮炮兵0","541":"炮炮兵8","542":"炮炮兵9","543":"炮炮兵10","544":"炮炮兵11","608":"热门60","610":"热门59","611":"最近使用17","628":"胡歌4","629":"胡歌5","630":"胡歌6","631":"胡歌7","660":"风暴英雄0","661":"风暴英雄1","662":"风暴英雄2","663":"风暴英雄3","664":"风暴英雄4","665":"风暴英雄5","666":"风暴英雄6","667":"风暴英雄7","668":"风暴英雄8","669":"风暴英雄9","670":"风暴英雄10","671":"风暴英雄11","672":"暗黑破坏神Ⅲ0","673":"暗黑破坏神Ⅲ1","674":"暗黑破坏神Ⅲ2","675":"暗黑破坏神Ⅲ3","676":"暗黑破坏神Ⅲ4","677":"暗黑破坏神Ⅲ5","678":"暗黑破坏神Ⅲ6","679":"暗黑破坏神Ⅲ7","680":"暗黑破坏神Ⅲ8","681":"暗黑破坏神Ⅲ9","682":"暗黑破坏神Ⅲ10","683":"暗黑破坏神Ⅲ11","684":"星际争霸II0","685":"星际争霸II1","686":"星际争霸II2","687":"星际争霸II3","688":"星际争霸II4","689":"星际争霸II5","690":"星际争霸II6","691":"星际争霸II7","692":"星际争霸II8","693":"星际争霸II9","694":"星际争霸II10","695":"星际争霸II11","720":"热门61","721":"魔兽世界0","722":"魔兽世界1","723":"魔兽世界2","724":"魔兽世界3","725":"魔兽世界4","726":"魔兽世界5","727":"魔兽世界6","728":"魔兽世界7","729":"魔兽世界8","730":"魔兽世界9","731":"魔兽世界10","732":"魔兽世界11","733":"炉石传说0","734":"炉石传说1","735":"炉石传说2","736":"炉石传说3","737":"炉石传说4","738":"炉石传说5","739":"炉石传说6","740":"炉石传说7","741":"炉石传说8","742":"炉石传说9","743":"炉石传说10","744":"炉石传说11","749":"冷兔0","750":"冷兔1","751":"冷兔2","752":"冷兔3","753":"冷兔4","754":"冷兔5","755":"冷兔6","756":"冷兔7","757":"冷兔8","758":"冷兔9","759":"冷兔10","760":"冷兔11","765":"热门54","766":"热门57","767":"热门55","768":"热门56","776":" 光线影业","777":" 光线影业","778":" 光线影业","781":" 光线影业","784":" 枫海影业","796":" 欢瑞世纪","797":" 欢瑞世纪","798":" 欢瑞世纪","799":" 欢瑞世纪","800":" 欢瑞世纪","801":" 欢瑞世纪","802":" 恒业影业","803":" 周迅工作室","804":" 华映传媒","805":" 爱奇艺","806":" 爱奇艺","807":" 爱奇艺","808":" 世纪长龙","809":" 世纪长龙","810":" 世纪长龙","811":" 嘉映影业","812":" 林心如工作室","813":" 环球影业","814":" 环球影业","815":" 环球影业","816":" 环球影业","817":" 环球影业","818":" 环球影业","819":" 派拉蒙影业","820":" 派拉蒙影业","821":" 黄子韬工作室","822":" 高品图像","823":" 高品图像","824":" 高品图像","825":" 高品图像","826":" 高品图像","827":" 爱奇艺影业","828":" 爱奇艺影业","829":" 优酷","830":" 基美影业","831":" 基美影业","832":" 魔威映画","833":" 亚洲星光娱乐","834":" 周冬雨工作室","835":"守望先锋0","836":"守望先锋1","837":"守望先锋2","838":"守望先锋3","839":"守望先锋4","840":"守望先锋5","841":"守望先锋6","842":"守望先锋7","843":"守望先锋8","844":"守望先锋9","845":"守望先锋10","846":"守望先锋11","859":" 记忆大师","860":"冒险岛20","861":"冒险岛21","862":"冒险岛22","863":"冒险岛23","864":"冒险岛24","865":"冒险岛25","866":"冒险岛26","867":"冒险岛27","868":"冒险岛28","869":"冒险岛29","870":"冒险岛210","871":"冒险岛211","872":" 天龙八部","873":" 天龙八部","874":" 变形金刚ol","875":" 变形金刚ol","876":" 一品芝麻狐","877":" 一品芝麻狐","878":" 一品芝麻狐","879":" 一品芝麻狐","880":" 一品芝麻狐","881":" 一品芝麻狐","882":" 白敬亭","883":" 剑灵","886":" 最强nba","887":" 最强nba","2371":"柳岩1","2481":"赵丽颖1"}
        const LOCAL_STORAGE_PREFIX = '$CSDNCleaner_'
        const BackgroundImageRange = {
            STATE_SELECTED_CATEGORY: 'STATE_SELECTED_CATEGORY',
            range: {
                categorys: [],
                imgs: [],
                customUrl: ''
            },
            init() {
                const range = localStorage.getItem(LOCAL_STORAGE_PREFIX + 'background_ranges')
                if (range) {
                    try {
                        const _range = JSON.parse(range)
                        if (!_range || typeof _range !== 'object') throw new Error('range data error')
                        Object.assign(this.range, _range)
                    } catch (err) {
                        console.error(err)
                    }
                }
            },
            toCategoryHTML () {
                let html = ''
                for (const categoryName in IMG_CATEGORYS) {
                    html += `<div class="category ${this.range.categorys.includes(categoryName) ? this.STATE_SELECTED_CATEGORY : '' }" data-key="${categoryName}">${categoryName}</div>\n`
                }
                return html
            },
            save() {
                console.warn('save to localStorage', this)
                localStorage.setItem(LOCAL_STORAGE_PREFIX + 'background_ranges', JSON.stringify(window.$CSDNCleaner.BackgroundImageRange.range))
            },
            getImgUrl () {
                const customUrl = this.range.customUrl
                if (customUrl) {
                    return `url(${customUrl})`
                } else if (this.range.categorys && this.range.categorys.length) {
                    const idList = this._getAllImgIdsByCategorys()
                    const index = this.getRandomInterger(idList.length)
                    const id = idList[index.toString()]
                    return `url(https://ss2.bdstatic.com/lfoZeXSm1A5BphGlnYG/skin/${id}.jpg)`
                } else {
                    const allImgs = Object.keys(IMG_MAP)
                    const index = this.getRandomInterger(allImgs.length)
                    const id = allImgs[index.toString()]
                    return `url(https://ss2.bdstatic.com/lfoZeXSm1A5BphGlnYG/skin/${id}.jpg)`
                }
            },
            _getAllImgIdsByCategorys () {
                const idList = []
                for (const categoryName in this.range.categorys) {
                    idList.push(...IMG_CATEGORYS[this.range.categorys[categoryName]])
                }
                return idList
            },
            getRandomInterger (size) {
                return Math.ceil(Math.random() * size) - 1
            }
        }
        window.$CSDNCleaner = {
            NAME: 'CSDN 去广告沉浸阅读模式',
            BackgroundImageRange,
            options: [],
            launch () {
                console.log(`%c[${window.$CSDNCleaner.NAME}] 感谢支持, 欢迎反馈: https://greasyfork.org/zh-CN/scripts/373457-csdn-%E5%8E%BB%E5%B9%BF%E5%91%8A%E6%B2%89%E6%B5%B8%E9%98%85%E8%AF%BB%E6%A8%A1%E5%BC%8F/feedback`, 'color: teal')
                window.addEventListener('DOMContentLoaded', window.$CSDNCleaner.onLoad)
                return this
            },
            init () {
                console.warn('exists body head ?', !!document.getElementsByTagName('head')[0])
                BackgroundImageRange.init() // 从本地存储中获取配置
                window.$CSDNCleaner
                    .initSettings() // 初始化按钮组
                    .appendSheets() // 添加样式
                    // .cleanCopy() // 解禁复制功能
                    .launch() // DOM 初始化
            },
            // 生成 sheets
            _getSheets () {
                const sheets = `
                    body { background-image: ${window.$CSDNCleaner.BackgroundImageRange.getImgUrl()} !important; background-color:#EAEAEA !important; background-attachment: fixed !important;background-size; cover; background-repeat: no-repeat; background-size: 100% !important; }
                    body>.container.container-box,main,body>.main.clearfix { opacity: 0.9; }
                    main {margin: 20px;}
                    #local { position: fixed; left: -99999px }
                    .recommend-item-box .content,.post_feed_box,.topic_r,.mod_topic_wrap,#bbs_title_bar,#bbs_detail_wrap,#left-box,main {width: 100% !important;}
                    .post_body div[data-pid],#unlogin-tip-box,.t0.clearfix,.recommend-item-box.recommend-recommend-box,.hljs-button.signin,.csdn-side-toolbar>a[data-type=help],.csdn-side-toolbar>a[data-type=vip],.csdn-side-toolbar>a[data-type=app],.csdn-side-toolbar>a[data-type=cs],.csdn-side-toolbar>a[data-type=report],a[href^="https://edu.csdn.net/topic"],.adsbygoogle,.mediav_ad,.bbs_feed_ad_box,.bbs_title_h,.title_bar_fixed,#adContent,.crumbs,#page>#content>#nav,#local,#reportContent,.comment-list-container>.opt-box.text-center,.type_hot_word,.blog-expert-recommend-box,.login-mark,#passportbox,.hljs-button.signin,.recommend-download-box,.recommend-ad-box,#dmp_ad_58,.blog_star_enter,#header,.blog-sidebar,#new_post.login,.mod_fun_wrap,.hide_topic_box,.bbs_bread_wrap,.news-nav,#rightList.right-box,aside,#kp_box_476,.tool-box,.recommend-right,.pulllog-box,.adblock,.fourth_column,.hide-article-box,#csdn-toolbar
                        {display: none !important;}
                    .hide-main-content,#blog_content,#bbs_detail_wrap,.article_content {height: auto !important;}
                    .comment-list-box,#bbs_detail_wrap {max-height: none !important;}
                    #main {width: 100% !important;}
                    #page {width: 80vw !important;}
                    #bbs_title_bar {margin-top: 20px;}
                    #page>#content {margin-top: 0 !important;}
                    #bbs_title_bar > .owner_top,.blog-content-box { border-top-left-radius: 8px; border-top-right-radius: 8px; }
                    body > div#page {background-color: transparent}
                    .dl_no_more:after { content: "上边是原话, 脚本作者原本想屏蔽这段话, 但是 CSDN 从未找到自己的底线;\\A 从阅读更多必须注册, 到验证手机号必须关注公众号, 再到大尺度H广告, 严重影响了用户体验;\\A 自从 CSDN 使用明文密码被脱库之后我就不再使用 CSDN 账号, 为了继续阅读 CSDN 内容我写了这个脚本  "; color: teal; display: block; width: 60%; margin: auto; white-space: pre; }
                    /* 脚本设置弹窗 */
                    a.option-box[data-type="$setting"] img {
                        -webkit-transform: rotate(360deg);
                        animation: rotation 2.5s linear 1;
                        -moz-animation: rotation 2.5s linear 1;
                        -webkit-animation: rotation 2.5s linear 1;
                        -o-animation: rotation 2.5s linear 1;
                    }
                    #setting-dialog {
                        display: block;
                        position: fixed;
                        top: 25vh;
                        width: 100%;
                        height: 100%;
                        display: flex;
                        opacity: 0.9;
                        justify-content: center;
                    }
                    #setting-dialog section header {
                        height: 50px;
                        font-size: 20px;
                        background: none;
                        padding: 0 15px;
                        display: flex;
                        justify-content: space-between;
                        padding: 0 15px;
                        align-items: center;
                    }
                    #setting-dialog section header .icon-close {
                        color: red;
                        cursor: pointer;
                    }
                    #setting-dialog section article .row {
                        margin-bottom: 10px;
                    }
                    #setting-dialog section article .row > label {
                        font-weight: bold;
                    }
                    /* 链接输入框 */
                    #custom-bg-url { width: 420px; margin-right: 10px; }
                    #setting-dialog section article .row > .content {
                        display: flex;
                        width: 500px;
                        flex-wrap: wrap;
                        align-items: center;
                    }
                    #setting-dialog section article .row > .content > div {
                        color: grey;
                        margin-right: 10px;
                        cursor: pointer;
                    }
                    #setting-dialog section article .row > .content > div:hover {
                        color: #000;
                    }
                    #setting-dialog section article .row > .content > div.STATE_SELECTED_CATEGORY {
                        color: #F60;
                        font-size: 20px;
                        letter-spacing: 1px;
                    }
                    #setting-dialog section article {
                        padding: 20px;
                        height: calc(100% - 50px);
                        overflow: auto;
                    }
                    #setting-dialog section article::-webkit-scrollbar {/*滚动条整体样式*/
                        width: 6px;     /*高宽分别对应横竖滚动条的尺寸*/
                        height: 6px;
                    }
                    #setting-dialog section article::-webkit-scrollbar-thumb {/*滚动条里面小方块*/
                        border-radius: 10%;
                        -webkit-box-shadow: inset 0 0 5px rgba(0,0,0,0.3);
                        background: rgba(0,0,0,0.3);
                    }
                    #setting-dialog section article::-webkit-scrollbar-track {/*滚动条里面轨道*/
                        -webkit-box-shadow: inset 0 0 5px rgba(0,0,0,0.3);
                        border-radius: 0;
                        background: rgba(0,0,0,0.1);
                    }
                    /* 弹窗内部样式 */
                    #setting-dialog section {
                        min-width: 500px;
                        height: 50vh;
                        min-height: 370px;
                        overflow: auto;
                        background-color: #EEE;
                        border-radius: 5px;
                    }
                    /* 自定义补充样式 */
                    .display-none {display: none !important;}
                    #setting-dialog .tips-line { color: grey; font-size: 12px }
                    #setting-dialog .link { color: blue; }
                    @-webkit-keyframes rotation{
                        from {-webkit-transform: rotate(0deg);}
                        to {-webkit-transform: rotate(360deg);}
                    }
                `
                return sheets
            },
            // 通过注入 css 实现隐藏广告并固定布局
            appendSheets () {
                const sheet = document.createTextNode(this._getSheets())
                const el = document.createElement('style')
                el.id = 'CSDM-cleaner-sheets'
                el.appendChild(sheet)
                document.getElementsByTagName('head')[0].appendChild(el)
                return this
            },
            // 复制功能
            cleanCopy () {
                csdn.copyright && csdn.copyright.init('', '', '')
                return this
            },
            onLoad () {
                // 图片下的底色
                document.body.setAttribute('style', 'background-color:#EAEAEA !important')
                // 解除跳转拦截
                $ && $("#content_views").off('click')
                // 初始化右侧 bottom menu tool bar
                window.$CSDNCleaner._loadSettings()
                window.$CSDNCleaner.cleanCopy() // 解禁复制功能
            },
            // 初始化 Options
            initSettings () {
                return this
            },
            _loadSettings () {
                const settingOption = this._fetchSettingOption()
                setTimeout(() => {
                    const wrapper = document.querySelector('.csdn-side-toolbar')
                    wrapper.appendChild(settingOption)
                }, 200)
            },
            _fetchSettingOption () {
                const opt = this._getOption({ dataType: '$setting', img: 'https://images.gitbook.cn/FuMNvLb25yJ4RiEg_2OnS8jpI8aB', name: '脚本<br>设置' })
                opt.addEventListener('click', evt => {
                    this.toggleDialog()
                })
                this._fetchSettingDialog()._bindDialogEvents()
                return opt
            },
            _fetchSettingDialog () {
                const settingDialog = document.createElement('div')
                settingDialog.id = 'setting-dialog'
                settingDialog.classList.add('display-none')
                const categorys = BackgroundImageRange.toCategoryHTML()
                settingDialog.innerHTML = `
                    <section>
                        <header>
                            <div>设置 - [${this.NAME}]</div>
                            <div class="icon-close">关闭</div>
                        </header>
                        <article>
                            <div class="row">
                                <label>背景图片类目范围(点选): </label>
                                <div class="content">
                                    ${categorys}
                                </div>
                            </div>
                            <div class="row">
                                <label>自定义背景图片链接(固定使用此链接): </label>
                                <div class="tips-line">您可以选择上传百度首页自定义背景图片, 然后将链接填入</div>
                                <div class="content">
                                    <input id="custom-bg-url" value="${BackgroundImageRange.range.customUrl}"/>
                                    <button id="btn-save-bg">保存</button>
                                </div>
                            </div>
                            <div class="row">
                                <label>联系作者: </label>
                                <div class="content">
                                    <div class="tips-line">问题/反馈:</div>
                                    <div class="tips-line">
                                        <a class="link" href="https://greasyfork.org/zh-CN/scripts/373457-csdn-%E5%8E%BB%E5%B9%BF%E5%91%8A%E6%B2%89%E6%B5%B8%E9%98%85%E8%AF%BB%E6%A8%A1%E5%BC%8F/feedback" target="_blank">greasymonkey page</a>
                                    </div>
                                </div>
                            </div>
                        </article>
                    </section>
                `
                document.body.appendChild(settingDialog)
                return this
            },
            _bindDialogEvents () {
                const dialogWrapper = document.getElementById('setting-dialog')
                const urlInput = document.getElementById('custom-bg-url')
                const saveUrlBtn = document.getElementById('btn-save-bg')
                if (!dialogWrapper) { console.error(`[${window.$CSDNCleaner.NAME}] Internal error. dialog init failed.`); return }
                dialogWrapper.addEventListener('click', evt => {
                    if (evt.target.id === 'setting-dialog' || evt.target.classList.contains('icon-close')) { // 关闭弹窗
                        window.$CSDNCleaner.toggleDialog()
                    } else if (evt.target.classList.contains('category')) { // 选择背景图片类目
                        const key = evt.target.attributes.getNamedItem('data-key').value
                        let existsIndex = -1
                        if (BackgroundImageRange.range.categorys.length > 0) {
                            for (let cIndex = BackgroundImageRange.range.categorys.length; cIndex--;) {
                                if (BackgroundImageRange.range.categorys[cIndex] === key) {
                                    existsIndex = cIndex
                                    break
                                }
                            }
                        }
                        if (existsIndex === -1) {
                            BackgroundImageRange.range.categorys.push(key)
                            evt.target.classList.add('STATE_SELECTED_CATEGORY')
                        } else {
                            BackgroundImageRange.range.categorys.splice(existsIndex, 1)
                            evt.target.classList.remove('STATE_SELECTED_CATEGORY')
                        }
                        BackgroundImageRange.save()
                    }
                })
                // urlInput.addEventListener('input', evt => {
                //     saveUrlBtn.setAttribute('disabled', urlInput.value != BackgroundImageRange.range.customUrl)
                // })
                saveUrlBtn.addEventListener('click', evt => {
                    if (urlInput.value && !/^http(s)?\:.+/.test(urlInput.value)) {
                        alert('请输入正确的图片链接')
                        return false
                    }
                    BackgroundImageRange.range.customUrl = urlInput.value
                    BackgroundImageRange.save()
                })
            },
            toggleDialog() {
                const dialog = document.getElementById('setting-dialog')
                if (!dialog) throw new Error('dialog not found')
                dialog.classList.toggle('display-none')
            },
            _getOption ({dataType, img, name}) {
                const option = document.createElement('a')
                option.classList.add('option-box')
                option.setAttribute('data-type', dataType)
                const imgNode = document.createElement('img')
                imgNode.src = img
                const optionName = document.createElement('span')
                optionName.classList.add('show-txt')
                optionName.innerHTML = name
                option.appendChild(optionName)
                option.appendChild(imgNode)
                return option
            }
        }
        window.$CSDNCleaner.init()
    })()
})();