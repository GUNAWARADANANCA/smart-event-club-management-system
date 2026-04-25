const { connectDb, disconnectDb } = require('../src/config/db');

(async () => {
  try {
    await connectDb();

    // Import the News model using dynamic import for ESM
    const { default: News } = await import('../src/models/News.js');

    const existing = await News.countDocuments();
    if (existing > 0) {
      console.log(`Skip seed: "news" already has ${existing} document(s).`);
      return;
    }

    const SAMPLE_NEWS = [
      {
        category: 'Sports',
        tag: '🏆 Achievement',
        title: 'Swimming Team Wins National Championship',
        summary: 'Our university swimming team clinched gold at the National Inter-University Swimming Championship, with three students breaking national records.',
        author: 'Sports Desk',
        color: 'from-[#2980b9] to-[#154360]',
        accent: '#2980b9',
        isPublished: true,
      },
      {
        category: 'Academic',
        tag: '🎓 Excellence',
        title: 'Students Win International AI Research Award',
        summary: 'A team of final-year computing students took first place at the Global AI Innovation Summit, impressing judges with their healthcare prediction model.',
        author: 'Academic Affairs',
        color: 'from-[#4CAF50] to-[#2E7D32]',
        accent: '#4CAF50',
        isPublished: true,
      },
      {
        category: 'Sports',
        tag: '⚽ Sports',
        title: 'Football Club Advances to Regional Finals',
        summary: 'The university football club secured a dramatic last-minute victory to advance to the regional finals, scheduled for next month.',
        author: 'Sports Desk',
        color: 'from-[#4ade80] to-[#1b5e20]',
        accent: '#4ade80',
        isPublished: true,
      },
      {
        category: 'Academic',
        tag: '📚 Academic',
        title: 'Dean\'s List 2026 Announced — Record Number of Honorees',
        summary: 'This semester saw a record-breaking number of students make the Dean\'s List, reflecting the rising academic standards across all faculties.',
        author: 'Registrar Office',
        color: 'from-[#f59e0b] to-[#7e5109]',
        accent: '#f59e0b',
        isPublished: true,
      },
      {
        category: 'Winning',
        tag: '🥇 Winner',
        title: 'CodeRed Hackathon Champions Announced',
        summary: 'Team ByteForce won the 48-hour CodeRed Hackathon, building a real-time campus safety alert system that impressed all five industry judges.',
        author: 'Events Team',
        color: 'from-[#8e44ad] to-[#4a235a]',
        accent: '#8e44ad',
        isPublished: true,
      },
      {
        category: 'Winning',
        tag: '🎨 Arts',
        title: 'Art Club Student Wins National Design Competition',
        summary: 'Second-year student Aisha Malik won the National Student Design Award for her digital art series exploring cultural identity and modern technology.',
        author: 'Arts & Culture',
        color: 'from-[#e74c3c] to-[#78281f]',
        accent: '#e74c3c',
        isPublished: true,
      },
      {
        category: 'Academic',
        tag: '🔬 Research',
        title: 'University Research Paper Published in Nature Journal',
        summary: 'A groundbreaking research paper by the Biology department on sustainable biofuels has been accepted and published in the prestigious Nature journal.',
        author: 'Research Office',
        color: 'from-[#1abc9c] to-[#0e6251]',
        accent: '#1abc9c',
        isPublished: true,
      },
      {
        category: 'Sports',
        tag: '🏸 Sports',
        title: 'Badminton Team Sweeps Inter-University Tournament',
        summary: 'The university badminton team won all five categories at the Inter-University Badminton Tournament, bringing home the overall championship trophy.',
        author: 'Sports Desk',
        color: 'from-[#3498db] to-[#1a5276]',
        accent: '#3498db',
        isPublished: true,
      },
    ];

    await News.insertMany(SAMPLE_NEWS);
    console.log(`Seeded ${SAMPLE_NEWS.length} news article(s) into collection "news".`);
  } catch (e) {
    console.error(e.message || e);
    process.exitCode = 1;
  } finally {
    await disconnectDb();
  }
})();
