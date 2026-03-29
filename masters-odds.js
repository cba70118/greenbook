// Masters 2026 odds update (FD + DK, parsed Mar 28)
// Patches into TOURNAMENT_DATA.masters.oddsBoard

(function() {
    if (!TOURNAMENT_DATA || !TOURNAMENT_DATA.masters) return;

    TOURNAMENT_DATA.masters.oddsBoard = [
        { rank:1, name:"Scottie Scheffler", fair:"+450", best:"+350 DK", b365:"+450", form:"warm", edge:"-2.1%" },
        { rank:2, name:"Rory McIlroy", fair:"+850", best:"+700 DK", b365:"+1000", form:"warm", edge:"-1.5%" },
        { rank:3, name:"Jon Rahm", fair:"+1000", best:"+1200", b365:"+1200", form:"warm", edge:"+1.6%" },
        { rank:4, name:"Bryson DeChambeau", fair:"+2500", best:"+1000 DK", b365:"+1100", form:"neutral", edge:"-8.2%" },
        { rank:5, name:"Ludvig Aberg", fair:"+1400", best:"+1600", b365:"+1200", form:"warm", edge:"+1.2%" },
        { rank:6, name:"Xander Schauffele", fair:"+1200", best:"+1600 FD", b365:"+1600", form:"warm", edge:"+2.1%" },
        { rank:7, name:"Tommy Fleetwood", fair:"+1600", best:"+1800 DK", b365:"+2200", form:"warm", edge:"+3.5%" },
        { rank:8, name:"Collin Morikawa", fair:"+1800", best:"+2200 DK", b365:"+2500", form:"caution", edge:"+2.0%" },
        { rank:9, name:"Cameron Young", fair:"+2000", best:"+2500 FD", b365:"+2500", form:"TAILWIND", edge:"+2.8%" },
        { rank:10, name:"Matt Fitzpatrick", fair:"+2000", best:"+2200 FD", b365:"+2500", form:"TAILWIND", edge:"+1.2%" },
        { rank:11, name:"Hideki Matsuyama", fair:"+2200", best:"+3300 FD", b365:"+3300", form:"warm", edge:"+3.8%" },
        { rank:12, name:"Jordan Spieth", fair:"+2500", best:"+3300 FD", b365:"+4500", form:"cool", edge:"+5.8%" },
        { rank:13, name:"Patrick Cantlay", fair:"+4000", best:"+5000 DK", b365:"+6600", form:"cool", edge:"+4.8%" },
        { rank:14, name:"Russell Henley", fair:"+3500", best:"+5500 FD", b365:"+5500", form:"warm", edge:"+4.2%" },
        { rank:15, name:"Cameron Smith", fair:"+3000", best:"+6600 DK", b365:"+8000", form:"neutral", edge:"+8.5%" },
        { rank:16, name:"Shane Lowry", fair:"+3500", best:"+4500", b365:"+5000", form:"cool", edge:"+2.8%" },
        { rank:17, name:"Adam Scott", fair:"+5000", best:"+6500 FD", b365:"+8000", form:"warm", edge:"+5.2%" },
        { rank:18, name:"Jason Day", fair:"+5500", best:"+6500 FD", b365:"+7000", form:"cool", edge:"+2.8%" },
        { rank:19, name:"Justin Rose", fair:"+12000", best:"+2700 FD", b365:"+2800", form:"neutral", edge:"-15.2%" },
        { rank:20, name:"Justin Thomas", fair:"+8000", best:"+4000 DK", b365:"+4500", form:"cool", edge:"-5.5%" },
        { rank:21, name:"Brooks Koepka", fair:"+4500", best:"+3000 FD", b365:"+4000", form:"neutral", edge:"-3.5%" },
        { rank:22, name:"Patrick Reed", fair:"+6000", best:"+2700 FD", b365:"+3300", form:"neutral", edge:"-8.0%" },
        { rank:23, name:"Will Zalatoris", fair:"+6000", best:"+5500 DK", b365:"+10000", form:"caution", edge:"+0.8%" },
        { rank:24, name:"Akshay Bhatia", fair:"+5000", best:"+5500", b365:"+5500", form:"caution", edge:"+0.8%" },
        { rank:25, name:"Si Woo Kim", fair:"+4500", best:"+5500 FD", b365:"+6600", form:"warm", edge:"+3.2%" },
    ];
})();
