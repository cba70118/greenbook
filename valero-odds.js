// Valero 2026 odds (DG odds 04:44 UTC Apr 2 R1 day | Preds 02:08 UTC Apr 1)
(function() {
    if (!TOURNAMENT_DATA || !TOURNAMENT_DATA.valero) return;

    TOURNAMENT_DATA.valero.oddsBoard = [
        { rank:1, name:"Ludvig Aberg", dgFair:"+2041", best:"+1200 b365", b365:"+1200", b365_8:"+1000", b365_10:"+900", form:"HEAD 0.78x", edge:"-4.5%", note:"SHORTENED to +1200 overnight. Clear solo favorite now. Still HEADWIND and comp #54 at TPC SA." },
        { rank:2, name:"Tommy Fleetwood", dgFair:"+2168", best:"+1425 DK", b365:"+1600", b365_8:"+1400", b365_10:"+1200", form:"cool 0.86x", edge:"-2.4%", note:"Stable. AN+RH love him. ARG#1 on Tour. Poa Triv putting risk." },
        { rank:3, name:"Robert MacIntyre", dgFair:"+2278", best:"+1800 DK/b365", b365:"+1800", b365_8:"+1600", b365_10:"+1400", form:"cool 0.93x", edge:"-1.2%", note:"Stable. Stewart's #1. Lefties 2/3 recent." },
        { rank:4, name:"Russell Henley", dgFair:"+2421", best:"+1600 b365/FD", b365:"+1600", b365_8:"+1400", b365_10:"+1200", form:"neutral 1.04x", edge:"-3.0%", note:"Stable. AN #1 unanimous. Market fully priced." },
        { rank:5, name:"Si Woo Kim", dgFair:"+2442", best:"+2150 DK", b365:"+2000", b365_8:"+1800", b365_10:"+1600", form:"warm 1.07x", edge:"-1.0%", note:"Stable. RH meta #4." },
        { rank:6, name:"Jordan Spieth", dgFair:"+2592", best:"+1600 b365/FD", b365:"+1600", b365_8:"+1400", b365_10:"+1200", form:"TAIL 1.57x", edge:"-3.8%", note:"Stable. Course king. Market loves him." },
        { rank:7, name:"Hideki Matsuyama", dgFair:"+2713", best:"+2200 b365/FD", b365:"+2200", b365_8:"+2000", b365_10:"+1800", form:"warm 1.14x", edge:"-1.6%", note:"ON CARD BOOSTED $20. Stable. APP+ARG dual fit." },
        { rank:8, name:"Maverick McNealy", dgFair:"+3027", best:"+2200 b365", b365:"+2200", b365_8:"+2000", b365_10:"+1800", form:"neutral 0.98x", edge:"-2.5%", note:"ON CARD +2400 DK. SHORTENED from +2500 to +2200 overnight. +CLV confirmed." },
        { rank:9, name:"Rickie Fowler", dgFair:"+3622", best:"+2600 DK", b365:"+3000", b365_8:"+2500", b365_10:"+2200", form:"cool 0.94x", edge:"-2.6%", note:"Slight drift b365 +2800->+3000. DG still says overpriced." },
        { rank:10, name:"Sepp Straka", dgFair:"+4456", best:"+2200 b365/FD", b365:"+2200", b365_8:"+2000", b365_10:"+1800", form:"cool 0.81x", edge:"-5.5%", note:"5 SOURCES. Stable. Narrative king. Market way tighter than DG." },
        { rank:11, name:"Keith Mitchell", dgFair:"+4280", best:"+3000 b365", b365:"+3000", b365_8:"+2800", b365_10:"+2500", form:"warm 1.06x", edge:"-2.7%", note:"Stable. Course history +0.150." },
        { rank:12, name:"Michael Thorbjornsen", dgFair:"+4435", best:"+2600 DK", b365:"+3500", b365_8:"+3000", b365_10:"+2800", form:"HEAD 0.77x", edge:"-4.2%", note:"b365 DRIFTED +3300->+3500. DG HEADWIND." },
        { rank:13, name:"Alex Noren", dgFair:"+5002", best:"+3300 b365/FD", b365:"+3300", b365_8:"+3000", b365_10:"+2800", form:"TAIL 1.24x", edge:"-3.3%", note:"ON CARD $10. Stable. TAILWIND. Wind specialist." },
        { rank:14, name:"J.J. Spaun", dgFair:"+5214", best:"+4000 FD", b365:"+5000", b365_8:"+4500", b365_10:"+4000", form:"warm 1.09x", edge:"-1.9%", note:"Stable. 2022 champion." },
        { rank:15, name:"Ryo Hisatsune", dgFair:"+6443", best:"+3500 b365/FD", b365:"+3500", b365_8:"+3300", b365_10:"+3000", form:"cool 0.88x", edge:"-5.5%", note:"FRL ON CARD. FRL shortened back to +4000 (was +4500)." },
        { rank:16, name:"Denny McCarthy", dgFair:"+6726", best:"+3300 FD", b365:"+4000", b365_8:"+3500", b365_10:"+3300", form:"TAIL 1.83x", edge:"-5.8%", note:"ON CARD +3000 b365. Stable. FRL at +4000. Strongest form in field." },
        { rank:17, name:"Marco Penge", dgFair:"+7858", best:"+5500 FD", b365:"+6600", b365_8:"+6000", b365_10:"+5500", form:"HEAD 0.69x", edge:"-1.6%", note:"DRIFTED +6000->+6600. DG HEADWIND." },
        { rank:18, name:"Jordan Smith", dgFair:"+8052", best:"+6500 FD", b365:"+6600", b365_8:"+6000", b365_10:"+5500", form:"HEAD 0.74x", edge:"-1.4%", note:"AN Kyle T20 pick. Ball-striking elite." },
        { rank:19, name:"Christiaan Bezuidenhout", dgFair:"+8052", best:"+7000 FD", b365:"+8000", b365_8:"+7000", b365_10:"+6000", form:"TAIL 1.32x", edge:"+1.3%", note:"ON CARD $10. DG EDGE at FD +7000. Best value on board. 4 signals." },
        { rank:20, name:"Nick Taylor", dgFair:"+8399", best:"+5000 FD", b365:"+6600", b365_8:"+6000", b365_10:"+5000", form:"TAIL 1.40x", edge:"-4.0%", note:"Mayo 'sleeping giant.' TAILWIND 1.40x." },
        { rank:21, name:"Thorbjorn Olesen", dgFair:"+9159", best:"+4500 FD", b365:"+5500", b365_8:"+5000", b365_10:"+4500", form:"neutral 1.04x", edge:"-6.3%", note:"FRL ON CARD. DRIFTED +5000->+5500. AN+Stewart like. TPC SA T11+T5." },
        { rank:22, name:"Rico Hoey", dgFair:"+10991", best:"+5000", b365:"+5000", b365_8:"+4500", b365_10:"+4000", form:"HEAD 0.73x", edge:"-7.0%", note:"2025 APP#2 at TPC SA." },
        { rank:23, name:"Brian Harman", dgFair:"+11828", best:"+5500", b365:"+5500", b365_8:"+5000", b365_10:"+4500", form:"TAIL 1.60x", edge:"-7.0%", note:"Stable. Defending champ." },
        { rank:24, name:"Sudarshan Yellamaraju", dgFair:"+10245", best:"+5000", b365:"+5000", b365_8:"+4500", b365_10:"+4000", form:"HEAD 0.73x", edge:"-5.7%", note:"ON CARD +14000 DK. AN Kyle validates." },
        { rank:25, name:"Mac Meissner", dgFair:"+7997", best:"+7000 FD", b365:"+8000", b365_8:"+7000", b365_10:"+6000", form:"neutral 1.03x", edge:"+1.2%", note:"FRL ON CARD. DG edge. Andy2 #6." },
        { rank:26, name:"ADDC", dgFair:"+10245", best:"+9000 b365", b365:"+9000", b365_8:"+8000", b365_10:"+7000", form:"cool 0.92x", edge:"-0.8%", note:"AN Spencer 105/1. ARG#12." },
        { rank:27, name:"Bud Cauley", dgFair:"+12400", best:"+10000", b365:"+10000", b365_8:"+9000", b365_10:"+8000", form:"TAIL 1.49x", edge:"-1.9%", note:"ON CARD $10. TAILWIND 1.49x. 2025 SG:TOT#7." },
        { rank:28, name:"Max McGreevy", dgFair:"+9917", best:"+7000 b365", b365:"+7000", b365_8:"+6000", b365_10:"+5500", form:"HEAD 0.75x", edge:"-3.4%", note:"Mayo: 'playing good golf again.'" },
    ];
})();
