import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  request: NextRequest,
  { params }: { params: { width: string; height: string } }
) {
  const { width, height } = await params;
  
  // Skateboarding/biking themed thumbnails
  const themes = [
    {
      bg: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      emoji: '🛹',
      text: 'Skateboard Tricks'
    },
    {
      bg: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
      emoji: '🚴',
      text: 'Mountain Biking'
    },
    {
      bg: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
      emoji: '🛴',
      text: 'BMX Stunts'
    },
    {
      bg: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
      emoji: '🏄',
      text: 'Longboarding'
    }
  ];
  
  // Select theme based on hash of dimensions (consistent for same size)
  const hash = parseInt(width) + parseInt(height);
  const theme = themes[hash % themes.length];
  
  // Generate an attractive SVG thumbnail
  const svg = `
    <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:#667eea;stop-opacity:1" />
          <stop offset="100%" style="stop-color:#764ba2;stop-opacity:1" />
        </linearGradient>
        <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="2" dy="2" stdDeviation="3" flood-color="#00000020"/>
        </filter>
      </defs>
      <rect width="100%" height="100%" fill="url(#grad1)"/>
      <circle cx="50%" cy="35%" r="25" fill="#ffffff40"/>
      <text x="50%" y="40%" text-anchor="middle" font-family="Arial, sans-serif" 
            font-size="32" fill="white" filter="url(#shadow)">${theme.emoji}</text>
      <text x="50%" y="65%" text-anchor="middle" font-family="Arial, sans-serif" 
            font-size="16" font-weight="bold" fill="white" filter="url(#shadow)">${theme.text}</text>
      <text x="50%" y="85%" text-anchor="middle" font-family="Arial, sans-serif" 
            font-size="12" fill="#ffffff80">${width}×${height}</text>
    </svg>
  `;

  return new NextResponse(svg, {
    headers: {
      'Content-Type': 'image/svg+xml',
      'Cache-Control': 'public, max-age=31536000, immutable',
    },
  });
}