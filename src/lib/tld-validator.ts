
// A comprehensive, but not exhaustive, list of common TLDs.
// This prevents simple typos like .coo or .con
const VALID_TLDS = new Set([
  'com', 'org', 'net', 'edu', 'gov', 'mil', 'int',
  'io', 'ai', 'co', 'app', 'dev', 'tech', 'info', 'biz', 'name', 'pro',
  'in', 'us', 'uk', 'ca', 'au', 'de', 'fr', 'jp', 'cn', 'ru',
  'online', 'site', 'website', 'space', 'store', 'xyz', 'club', 'design',
  'me', 'tv', 'academy', 'agency', 'art', 'blog', 'build', 'capital', 'cards',
  'care', 'cash', 'center', 'chat', 'city', 'cloud', 'coach', 'codes',
  'community', 'company', 'computer', 'construction', 'consulting', 'contractors',
  'credit', 'data', 'dating', 'deals', 'degree', 'delivery', 'democrat',
  'dental', 'diamonds', 'digital', 'direct', 'directory', 'discount', 'doctor',
  'dog', 'domains', 'earth', 'eco', 'education', 'email', 'energy', 'engineer',
  'enterprises', 'equipment', 'estate', 'events', 'exchange', 'expert', 'express',
  'fail', 'farm', 'fashion', 'finance', 'financial', 'fish', 'fitness', 'flights',
  'florist', 'flowers', 'food', 'football', 'forsale', 'foundation', 'fun',
  'fund', 'furniture', 'futbol', 'fyi', 'gallery', 'game', 'games', 'gifts',
  'glass', 'global', 'gold', 'golf', 'graphics', 'gratis', 'green', 'gripe',
  'group', 'guide', 'guru', 'haus', 'health', 'healthcare', 'help', 'hiphop',
  'hockey', 'holdings', 'holiday', 'home', 'hospital', 'house', 'how', 'immo',
  'immobilien', 'industries', 'ink', 'institute', 'insure', 'international',
  'investments', 'irish', 'jetzt', 'jewelry', 'jobs', 'joy', 'kim', 'kitchen',

  'land', 'law', 'lawyer', 'lease', 'legal', 'life', 'lighting', 'limited',
  'limo', 'live', 'llc', 'loan', 'loans', 'lol', 'lotto', 'love', 'ltd', 'luxury',
  'maison', 'management', 'market', 'marketing', 'mba', 'media', 'memorial',
  'men', 'menu', 'moda', 'money', 'mortgage', 'movie', 'music', 'network',
  'news', 'ninja', 'one', 'ong', 'onl', 'ooo', 'organic', 'partners', 'parts',
  'party', 'pet', 'phd', 'photo', 'photography', 'photos', 'pics', 'pictures',
  'pizza', 'place', 'plus', 'poker', 'porn', 'press', 'productions', 'promo',
  'properties', 'property', 'protection', 'pub', 'quebec', 'racing', 'radio',
  'recipes', 'red', 'rehab', 'reit', 'rent', 'rentals', 'repair', 'report',
  'republican', 'rest', 'restaurant', 'review', 'reviews', 'rich', 'rip',
  'rocks', 'rodeo', 'run', 'sale', 'save', 'school', 'science', 'secure',
  'security', 'services', 'sexy', 'shoes', 'shop', 'shopping', 'show', 'singles',
  'soccer', 'social', 'software', 'solar', 'solutions', 'soy', 'studio', 'style',
  'sucks', 'supplies', 'supply', 'support', 'surf', 'surgery', 'systems', 'tax',
  'taxi', 'team', 'technology', 'tennis', 'theater', 'tickets', 'tips', 'tires',
  'today', 'tools', 'tours', 'town', 'toys', 'trade', 'training', 'travel',
  'university', 'vacations', 'vegas', 'ventures', 'vet', 'video', 'villas',
  'vin', 'vision', 'vodka', 'vote', 'voting', 'voyage', 'watch', 'webcam',
  'wedding', 'wiki', 'win', 'wine', 'work', 'works', 'world', 'wtf', 'zone'
]);


export function isValidTLD(email: string): boolean {
    if (!email.includes('@') || !email.includes('.')) {
        return true; // Let the base zod email validator handle this
    }
    const parts = email.split('.');
    const tld = parts[parts.length - 1].toLowerCase();
    
    // Check if the TLD is purely alphabetic and has at least 2 characters
    if (!/^[a-z]{2,}$/.test(tld)) {
        return false;
    }
    
    return VALID_TLDS.has(tld);
}
