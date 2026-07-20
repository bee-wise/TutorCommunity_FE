import { Lesson, AIAnalyzeResponse } from './types';

export const MOCK_LESSONS: Lesson[] = [
  {
    id: '1',
    studentName: 'Nguyễn Văn A',
    subject: 'Toán học - Hệ phương trình',
    date: '20-07-2026',
    status: 'Not Generated',
  },
  {
    id: '2',
    studentName: 'Trần Thị B',
    subject: 'Vật lý - Động lực học',
    date: '19-07-2026',
    status: 'Drafting',
  },
  {
    id: '3',
    studentName: 'Lê Văn C',
    subject: 'Hóa học - Hữu cơ',
    date: '18-07-2026',
    status: 'Published',
  },
];

export const MOCK_AI_RESPONSE: AIAnalyzeResponse = {
  summary: {
    title: 'Hệ phương trình bậc nhất hai ẩn',
    overview: 'Bài học này giúp học sinh hiểu về khái niệm hệ phương trình bậc nhất hai ẩn và các phương pháp giải cơ bản như phương pháp thế và phương pháp cộng đại số.',
    key_concepts: [
      {
        name: 'Dạng tổng quát',
        explanation: 'Hệ hai phương trình bậc nhất hai ẩn x và y có dạng tổng quát như sau:',
        formulas: [
          {
            latex: '\\begin{cases}a_1x+b_1y=c_1\\\\a_2x+b_2y=c_2\\end{cases}',
            description: 'Trong đó $a_1, b_1, c_1, a_2, b_2, c_2$ là các hệ số, và ít nhất một trong các hệ số $a, b$ phải khác $0$.',
          },
        ],
      },
      {
        name: 'Phương pháp thế',
        explanation: 'Rút một ẩn từ một phương trình rồi thế vào phương trình còn lại để thu được phương trình một ẩn.',
        formulas: [],
      }
    ],
    prerequisites: ['Phương trình bậc nhất một ẩn', 'Biến đổi đại số cơ bản'],
  },
  quiz: {
    multiple_choice: [
      {
        question: 'Hệ phương trình $\\begin{cases}x+y=3\\\\2x-y=3\\end{cases}$ có nghiệm là:',
        options: [
          { label: 'A', content: '$(1, 2)$' },
          { label: 'B', content: '$(2, 1)$' },
          { label: 'C', content: '$(3, 0)$' },
          { label: 'D', content: '$(0, 3)$' }
        ],
        correct_answer: 'B',
        explanation: 'Giải hệ: Cộng 2 phương trình ta có $3x=6 \\Rightarrow x=2$. Thế vào PT 1: $2+y=3 \\Rightarrow y=1$. Vậy nghiệm là $(2, 1)$.',
        difficulty: 'easy',
      },
      {
        question: 'Điều kiện để hệ phương trình bậc nhất hai ẩn vô nghiệm là gì?',
        options: [
          { label: 'A', content: '$\\frac{a_1}{a_2} = \\frac{b_1}{b_2} \\neq \\frac{c_1}{c_2}$' },
          { label: 'B', content: '$\\frac{a_1}{a_2} \\neq \\frac{b_1}{b_2}$' },
          { label: 'C', content: '$\\frac{a_1}{a_2} = \\frac{b_1}{b_2} = \\frac{c_1}{c_2}$' },
          { label: 'D', content: '$a_1 = a_2 = 0$' }
        ],
        correct_answer: 'A',
        explanation: 'Khi hai đường thẳng biểu diễn hai phương trình song song với nhau thì hệ vô nghiệm, điều kiện là tỉ lệ các hệ số góc bằng nhau nhưng tung độ gốc khác nhau.',
        difficulty: 'medium',
      }
    ],
    exercises: [
      {
        problem: 'Giải hệ phương trình bằng phương pháp thế: $\\begin{cases}3x - y = 5 \\\\ x + 2y = 4\\end{cases}$',
        solution_steps: [
          { step_number: 1, description: 'Từ PT(2) suy ra $x = 4 - 2y$.' },
          { step_number: 2, description: 'Thế vào PT(1): $3(4 - 2y) - y = 5 \\Rightarrow 12 - 6y - y = 5 \\Rightarrow 7y = 7 \\Rightarrow y = 1$.' },
          { step_number: 3, description: 'Thay $y=1$ vào biểu thức của x: $x = 4 - 2(1) = 2$.' }
        ],
        final_answer: 'Nghiệm của hệ là $(2, 1)$.',
        difficulty: 'medium',
      }
    ]
  }
};
