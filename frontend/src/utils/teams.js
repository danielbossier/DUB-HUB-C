export const TEAM_COLORS = {
  mlb: {
    BAL: '#DF4601', BOS: '#BD3039', NYY: '#003087', TB:  '#092C5C', TOR: '#134A8E',
    CWS: '#27251F', CLE: '#00385D', DET: '#0C2340', KC:  '#004687', MIN: '#002B5C',
    HOU: '#002D62', LAA: '#003263', ATH: '#003831', SEA: '#0C2C56', TEX: '#003278',
    ATL: '#CE1141', MIA: '#00A3E0', NYM: '#002D72', PHI: '#E81828', WSH: '#AB0003',
    CHC: '#0E3386', CIN: '#C6011F', MIL: '#12284B', PIT: '#FDB827', STL: '#C41E3A',
    ARI: '#A71930', COL: '#333366', LAD: '#005A9C', SD:  '#2F241D', SF:  '#FD5A1E',
  },
  nfl: {
    BUF: '#00338D', MIA: '#008E97', NE:  '#002244', NYJ: '#125740',
    BAL: '#241773', CIN: '#FB4F14', CLE: '#FF3C00', PIT: '#FFB612',
    HOU: '#03202F', IND: '#002C5F', JAX: '#006778', TEN: '#002A5E',
    DEN: '#FB4F14', KC:  '#E31837', LV:  '#000000', LAC: '#0080C6',
    DAL: '#003594', NYG: '#0B2265', PHI: '#004C54', WSH: '#773141',
    CHI: '#0B162A', DET: '#0076B6', GB:  '#203731', MIN: '#4F2683',
    ATL: '#A71930', CAR: '#0085CA', NO:  '#101820', TB:  '#D50A0A',
    ARI: '#97233F', LAR: '#003594', SF:  '#AA0000', SEA: '#002244',
  },
  nba: {
    ATL: '#E03A3E', BOS: '#007A33', BKN: '#000000', CHA: '#1D1160', CHI: '#CE1141',
    CLE: '#860038', DAL: '#00538C', DEN: '#0E2240', DET: '#C8102E', GSW: '#1D428A',
    HOU: '#CE1141', IND: '#002D62', LAC: '#C8102E', LAL: '#552583', MEM: '#5D76A9',
    MIA: '#98002E', MIL: '#00471B', MIN: '#0C2340', NOP: '#0C2340', NYK: '#F58426',
    OKC: '#007AC1', ORL: '#0077C0', PHI: '#006BB6', PHX: '#1D1160', POR: '#E03A3E',
    SAC: '#5A2D81', SAS: '#000000', TOR: '#CE1141', UTA: '#002B5C', WSH: '#002B5C',
  },
  nhl: {
    BOS: '#FCB514', BUF: '#003087', DET: '#CE1126', FLA: '#041E42', MTL: '#AF1E2D',
    OTT: '#DA1A32', TBL: '#002868', TOR: '#00205B', CAR: '#CC0000', CBJ: '#002654',
    NJD: '#CE1126', NYI: '#00539B', NYR: '#0038A8', PHI: '#F74902', PIT: '#FCB514',
    WSH: '#041E42', CHI: '#CF0A2C', COL: '#6F263D', DAL: '#006847', MIN: '#154734',
    NSH: '#FFB81C', STL: '#002F87', UTA: '#69B3E7', WPG: '#041E42', ANA: '#FC4C02',
    CGY: '#C8102E', EDM: '#FF4C00', LAK: '#111111', SEA: '#001628', SJS: '#006D75',
    VAN: '#00843D', VGK: '#B4975A',
  },
};

export function getTeamColor(sport, abbreviation) {
  return TEAM_COLORS[sport]?.[abbreviation] ?? '#334155';
}

export function getLogoUrl(sport, externalId) {
  if (!externalId) return null;
  switch (sport) {
    case 'mlb':
      // MLB static CDN uses the MLB Stats API numeric team ID
      return `https://www.mlbstatic.com/team-logos/${externalId}.svg`;
    case 'nfl':
      return `https://a.espncdn.com/i/teamlogos/nfl/500/${externalId}.png`;
    case 'nba':
      return `https://a.espncdn.com/i/teamlogos/nba/500/${externalId}.png`;
    case 'nhl': {
      // ESPN uses shorter abbreviations for some NHL teams
      const NHL_ESPN_ABBR = { TBL: 'tb', SJS: 'sj', LAK: 'la', NJD: 'nj' };
      const abbr = NHL_ESPN_ABBR[String(externalId).toUpperCase()] ?? String(externalId).toLowerCase();
      return `https://a.espncdn.com/i/teamlogos/nhl/500/${abbr}.png`;
    }
    default:
      return null;
  }
}
