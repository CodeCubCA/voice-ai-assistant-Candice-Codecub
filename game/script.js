// Global state
let windowId = 0;
let activeWindow = null;
let windows = {};
let zIndex = 10;

// Game state
const gameState = {
    playerName: 'Alex',
    salary: 4500,
    clientsHelpedToday: 0,
    totalClientsHelped: 0,
    day: 1,
    contacts: {
        boss: {
            id: 'boss',
            name: 'Sarah Mitchell',
            title: 'Branch Manager',
            avatar: 'SM',
            messages: [
                {
                    id: 1,
                    from: 'boss',
                    text: `Welcome to RCFC! I'm Sarah, your branch manager. So glad to have you on the team!

You're our newest Personal Banker. You've been assigned 10 clients - they're YOUR people now. They'll come to you with everything: loan applications, questions about rates, account issues, you name it.

Here's how it works:

• These clients are assigned to you permanently
• They'll message you throughout the day with requests
• Help them with loans, answer questions about rates and accounts
• Process loan applications when they apply
• Build relationships - some are easy, some are... difficult
• Starting salary: $4,500/month

Your tools:
• RCFC Portal - view client profiles and process loan applications
• Credit Bureau - check credit history and find hidden debts
• Investigation Dept - report fraud (use sparingly!)

Fair warning: some clients don't tell the whole truth about their finances. If someone applies for a loan and the numbers don't add up, dig deeper before approving.

Your clients have different personalities - some are lovely, some are rude, some will try to charm you. Handle them professionally!

Good luck! I'm here if you need me.

- Sarah`,
                    timestamp: new Date(Date.now() - 60000).toISOString(),
                    read: false
                }
            ],
            typing: false,
            online: true
        },
        creditbureau: {
            id: 'creditbureau',
            name: 'Credit Bureau',
            title: 'RCFC Credit Services',
            avatar: 'CB',
            messages: [
                {
                    id: 1,
                    from: 'creditbureau',
                    text: `RCFC Credit Bureau Services

To request a credit report, send us:
• Applicant's full name
• Application ID

We will respond with:
• Total number of existing loans
• Payment history summary
• Any delinquencies or defaults

Standard processing time: 2-4 hours
Urgent requests available for high-risk applications.`,
                    timestamp: new Date(Date.now() - 120000).toISOString(),
                    read: false
                }
            ],
            typing: false,
            online: true,
            personality: 'bureaucratic and by-the-book, efficient but impersonal',
            speakingStyle: 'formal corporate, uses lots of jargon and acronyms'
        },
        investigation: {
            id: 'investigation',
            name: 'Investigation Dept',
            title: 'Fraud & Compliance',
            avatar: 'ID',
            personality: 'suspicious and serious, treats everything like a crime scene',
            speakingStyle: 'detective-like, asks probing questions, slightly paranoid',
            messages: [
                {
                    id: 1,
                    from: 'investigation',
                    text: `Investigation Department - Fraud & Compliance Division

Report suspicious activity by providing:
• Application ID
• Applicant name
• Specific concerns (document inconsistencies, false information, etc.)

DO NOT confront applicants directly about suspected fraud.
DO NOT approve applications under investigation.

All reports are confidential. We will notify you of findings within 24-48 hours.`,
                    timestamp: new Date(Date.now() - 120000).toISOString(),
                    read: false
                }
            ],
            typing: false,
            online: true
        }
    },
    currentChat: 'boss',
    currentApplication: 0,
    screenshots: [],
    attachedScreenshot: null,
    loanApplications: [
        {
            id: 'APP-2024-0847',
            applicant: 'Michael R. Thompson',
            age: 34,
            address: '142 Maple Street, Vancouver, BC V6B 2T4',
            phone: '(604) 555-0182',
            email: 'mthompson.home@gmail.com',
            amount: 25000,
            purpose: 'Home Renovation - Kitchen and bathroom remodel',
            creditScore: 720,
            annualIncome: 68000,
            monthlyDebt: 1200,
            employmentStatus: 'Full-time',
            employer: 'TechCorp Solutions Inc.',
            employerPhone: '(604) 555-8900',
            yearsEmployed: 5,
            bankStatements: true,
            taxReturns: true,
            notes: 'Applicant states no other outstanding loans. Monthly debt seems consistent with reported expenses.',
            hiddenLoans: 1,
            honesty: 'forgetful',
            nationality: 'Canadian',
            personality: 'friendly regular guy, easy to talk to, treats you like a buddy',
            speakingStyle: 'casual and relaxed, makes small talk about sports and weekends',
            status: 'pending',
            accountType: 'Premium Checking + Savings',
            clientSince: '2019',
            currentNeeds: 'Loan application for home renovation',
            accounts: [
                { accountNumber: '****4521', type: 'Premium Checking', balance: 8432.50, status: 'Active' },
                { accountNumber: '****4522', type: 'High-Interest Savings', balance: 24150.00, interestRate: 2.5, status: 'Active' },
                { accountNumber: '****4523', type: 'TFSA', balance: 18500.00, interestRate: 2.0, status: 'Active' },
                { accountNumber: '****7821', type: 'Visa Infinite', creditLimit: 15000, balance: -2340.67, interestRate: 19.99, status: 'Active' },
                { accountNumber: '****7822', type: 'Mastercard', creditLimit: 8000, balance: -1205.30, interestRate: 21.99, status: 'Active' },
                { accountNumber: '****9901', type: 'Home Equity LOC', creditLimit: 50000, balance: -12400.00, interestRate: 7.45, status: 'Active' },
                { accountNumber: '****3301', type: 'RRSP', balance: 45230.00, status: 'Active' },
                { accountNumber: '****6601', type: 'Joint Checking', balance: 3241.80, status: 'Active' }
            ]
        },
        {
            id: 'APP-2024-0848',
            applicant: 'Sarah J. Chen',
            age: 28,
            address: '2891 Oak Avenue, Unit 12, Toronto, ON M4K 1P3',
            phone: '(416) 555-0294',
            email: 'sarah.chen88@outlook.com',
            amount: 15000,
            purpose: 'Vehicle Purchase - 2021 Honda Civic',
            creditScore: 680,
            annualIncome: 52000,
            monthlyDebt: 800,
            employmentStatus: 'Full-time',
            employer: 'Toronto General Hospital',
            employerPhone: '(416) 555-4200',
            yearsEmployed: 3,
            bankStatements: true,
            taxReturns: true,
            notes: 'Monthly debt seems low for Toronto cost of living. May have unreported obligations. Recommend verification.',
            hiddenLoans: 2,
            honesty: 'deceptive',
            nationality: 'Chinese-Canadian',
            personality: 'genuinely attracted to you, gets nervous and giggly around you, finds excuses to chat',
            speakingStyle: 'sweet and slightly shy, laughs at your jokes, asks personal questions',
            status: 'pending',
            accountType: 'Basic Checking',
            clientSince: '2022',
            currentNeeds: 'Car loan application, but really just wants to talk to you',
            accounts: [
                { accountNumber: '****8832', type: 'Basic Checking', balance: 2156.40, status: 'Active' },
                { accountNumber: '****8833', type: 'eSavings', balance: 890.00, interestRate: 1.5, status: 'Active' },
                { accountNumber: '****5541', type: 'Visa Classic', creditLimit: 5000, balance: -4230.00, interestRate: 19.99, status: 'Active' },
                { accountNumber: '****5542', type: 'Student Mastercard', creditLimit: 1500, balance: -1480.00, interestRate: 18.99, status: 'Active' }
            ]
        },
        {
            id: 'APP-2024-0849',
            applicant: 'Robert A. Williams',
            age: 45,
            address: '8734 Industrial Blvd, Calgary, AB T2P 0G7',
            phone: '(403) 555-0471',
            email: 'rwilliams.auto@shaw.ca',
            amount: 50000,
            purpose: 'Business Expansion - New diagnostic equipment and parts inventory',
            creditScore: 590,
            annualIncome: 85000,
            monthlyDebt: 2500,
            employmentStatus: 'Self-employed',
            employer: 'Williams Auto Repair Ltd.',
            employerPhone: '(403) 555-0471',
            yearsEmployed: 12,
            bankStatements: true,
            taxReturns: false,
            notes: 'Tax returns pending - applicant claims accountant delay. Business revenue shows seasonal fluctuation. Self-reported debt may be incomplete. High-risk category due to credit score.',
            hiddenLoans: 3,
            honesty: 'deceptive',
            nationality: 'Canadian',
            personality: 'hardworking business owner, straight-shooter, respects your time',
            speakingStyle: 'direct but friendly, talks about his shop and employees like family',
            status: 'pending',
            accountType: 'Business Checking',
            clientSince: '2015',
            currentNeeds: 'Business loan for expansion',
            accounts: [
                { accountNumber: '****1201', type: 'Business Checking', balance: 12450.80, status: 'Active' },
                { accountNumber: '****1202', type: 'Business Savings', balance: 8900.00, interestRate: 1.8, status: 'Active' },
                { accountNumber: '****1203', type: 'Payroll Account', balance: 5230.00, status: 'Active' },
                { accountNumber: '****1204', type: 'Operating LOC', creditLimit: 75000, balance: -48200.00, interestRate: 8.25, status: 'Active' },
                { accountNumber: '****6671', type: 'Business Visa', creditLimit: 25000, balance: -18750.00, interestRate: 16.99, status: 'Active' },
                { accountNumber: '****6672', type: 'Personal Visa', creditLimit: 10000, balance: -8920.00, interestRate: 19.99, status: 'Active' },
                { accountNumber: '****1205', type: 'Equipment Loan', balance: -34500.00, interestRate: 6.5, monthlyPayment: 890, status: 'Active' },
                { accountNumber: '****1206', type: 'Vehicle Loan', balance: -22100.00, interestRate: 5.99, monthlyPayment: 520, status: 'Active' },
                { accountNumber: '****1207', type: 'Personal Checking', balance: 3240.50, status: 'Active' },
                { accountNumber: '****3391', type: 'RRSP', balance: 28400.00, status: 'Active' },
                { accountNumber: '****1208', type: 'Term Deposit', balance: 15000.00, interestRate: 3.5, maturityDate: '2025-06-15', status: 'Active' }
            ]
        },
        {
            id: 'APP-2024-0850',
            applicant: 'Emily S. Davis',
            age: 31,
            address: '567 Pine Road, Apt 4B, Montreal, QC H3B 2Y7',
            phone: '(514) 555-0638',
            email: 'emilyd_1993@hotmail.com',
            amount: 8000,
            purpose: 'Debt Consolidation - Credit card and personal loan payoff',
            creditScore: 640,
            annualIncome: 45000,
            monthlyDebt: 1500,
            employmentStatus: 'Full-time',
            employer: 'Retail Mart Inc.',
            employerPhone: '(514) 555-7100',
            yearsEmployed: 2,
            bankStatements: true,
            taxReturns: true,
            notes: 'High debt-to-income ratio. Purpose is consolidation but listed debts ($1500/mo) don\'t match consolidation amount requested. Possible undisclosed debts. Requires investigation.',
            hiddenLoans: 4,
            honesty: 'forgetful',
            nationality: 'British (immigrated)',
            personality: 'sweet and genuine, appreciates your help, easy to get along with',
            speakingStyle: 'polite British English, warm and conversational',
            status: 'pending',
            accountType: 'Basic Checking + Savings',
            clientSince: '2021',
            currentNeeds: 'Debt consolidation loan, needs guidance on her finances',
            accounts: [
                { accountNumber: '****7744', type: 'Basic Checking', balance: 542.30, status: 'Active' },
                { accountNumber: '****7745', type: 'Basic Savings', balance: 1230.00, interestRate: 0.5, status: 'Active' },
                { accountNumber: '****7746', type: 'eSavings', balance: 340.00, interestRate: 1.5, status: 'Active' },
                { accountNumber: '****2231', type: 'Visa Classic', creditLimit: 3500, balance: -3480.00, interestRate: 19.99, status: 'Active' },
                { accountNumber: '****2232', type: 'Mastercard', creditLimit: 5000, balance: -4890.00, interestRate: 21.99, status: 'Active' },
                { accountNumber: '****2233', type: 'Store Credit Card', creditLimit: 2000, balance: -1850.00, interestRate: 28.99, status: 'Active' },
                { accountNumber: '****8891', type: 'Personal Loan', balance: -6200.00, interestRate: 12.5, monthlyPayment: 280, status: 'Active' },
                { accountNumber: '****7747', type: 'Overdraft Protection', creditLimit: 1500, balance: -890.00, interestRate: 21.0, status: 'Active' }
            ]
        },
        {
            id: 'APP-2024-0851',
            applicant: 'James L. Anderson',
            age: 52,
            address: '29 Prestige Court, Ottawa, ON K1P 5J6',
            phone: '(613) 555-0822',
            email: 'j.anderson@andersonlaw.ca',
            amount: 75000,
            purpose: 'Investment Property - Down payment on rental unit in Gatineau',
            creditScore: 780,
            annualIncome: 120000,
            monthlyDebt: 3000,
            employmentStatus: 'Full-time',
            employer: 'Anderson & Associates Law Firm',
            employerPhone: '(613) 555-0900',
            yearsEmployed: 20,
            bankStatements: true,
            taxReturns: true,
            notes: 'Strong application. Excellent credit history. High income with stable 20-year employment. Existing mortgage on primary residence disclosed. Low risk.',
            hiddenLoans: 0,
            honesty: 'honest',
            nationality: 'Canadian',
            personality: 'successful but down-to-earth, treats everyone with respect, good mentor vibes',
            speakingStyle: 'professional but warm, shares advice and life experience',
            status: 'pending',
            accountType: 'Private Banking',
            clientSince: '2008',
            currentNeeds: 'Investment property loan',
            accounts: [
                { accountNumber: '****0001', type: 'Private Banking Checking', balance: 45230.00, status: 'Active' },
                { accountNumber: '****0002', type: 'Private Banking Savings', balance: 128500.00, interestRate: 3.0, status: 'Active' },
                { accountNumber: '****0003', type: 'Money Market', balance: 75000.00, interestRate: 3.5, status: 'Active' },
                { accountNumber: '****0004', type: 'USD Savings', balance: 32400.00, interestRate: 2.8, status: 'Active' },
                { accountNumber: '****0005', type: 'TFSA', balance: 88000.00, interestRate: 2.5, status: 'Active' },
                { accountNumber: '****0006', type: 'RRSP', balance: 425000.00, status: 'Active' },
                { accountNumber: '****0007', type: 'RESP', balance: 62000.00, status: 'Active' },
                { accountNumber: '****9001', type: 'Visa Infinite Privilege', creditLimit: 50000, balance: -8420.00, interestRate: 18.99, status: 'Active' },
                { accountNumber: '****9002', type: 'Amex Platinum', creditLimit: 35000, balance: -4200.00, interestRate: 19.99, status: 'Active' },
                { accountNumber: '****0008', type: 'Home Equity LOC', creditLimit: 250000, balance: -82000.00, interestRate: 6.45, status: 'Active' },
                { accountNumber: '****0009', type: 'Mortgage - Primary', balance: -485000.00, interestRate: 4.89, monthlyPayment: 2850, status: 'Active' },
                { accountNumber: '****0010', type: 'Investment Account', balance: 180000.00, status: 'Active' },
                { accountNumber: '****0011', type: 'GIC Portfolio', balance: 100000.00, interestRate: 4.2, maturityDate: '2025-12-01', status: 'Active' },
                { accountNumber: '****0012', type: 'Joint Checking', balance: 12400.00, status: 'Active' },
                { accountNumber: '****0013', type: 'Joint Savings', balance: 35000.00, interestRate: 2.5, status: 'Active' }
            ]
        },
        {
            id: 'APP-2024-0852',
            applicant: 'Lisa M. Martinez',
            age: 22,
            address: '1456 College Street, Edmonton, AB T5J 2R4',
            phone: '(780) 555-0193',
            email: 'lisa.martinez.edu@gmail.com',
            amount: 12000,
            purpose: 'Education - Master\'s program tuition and textbooks',
            creditScore: 710,
            annualIncome: 38000,
            monthlyDebt: 400,
            employmentStatus: 'Part-time',
            employer: 'University of Alberta Library',
            employerPhone: '(780) 555-3200',
            yearsEmployed: 1,
            bankStatements: true,
            taxReturns: true,
            notes: 'Part-time student employment. Income may increase post-graduation. Low current debt. Education loans typically lower risk for repayment.',
            hiddenLoans: 1,
            honesty: 'honest',
            nationality: 'Mexican-Canadian',
            personality: 'friendly and eager to learn, hardworking student, grateful for your help',
            speakingStyle: 'casual and upbeat, asks good questions, enthusiastic',
            status: 'pending',
            accountType: 'Student Checking',
            clientSince: '2023',
            currentNeeds: 'Student loan for her Masters program',
            accounts: [
                { accountNumber: '****3321', type: 'Student Checking', balance: 1245.80, status: 'Active' },
                { accountNumber: '****3322', type: 'Student Savings', balance: 2100.00, interestRate: 1.0, status: 'Active' },
                { accountNumber: '****4451', type: 'Student Visa', creditLimit: 1000, balance: -680.00, interestRate: 19.99, status: 'Active' },
                { accountNumber: '****3323', type: 'Student LOC', creditLimit: 15000, balance: -8400.00, interestRate: 7.95, status: 'Active' }
            ]
        },
        {
            id: 'APP-2024-0853',
            applicant: 'David H. Kim',
            age: 39,
            address: '3892 Transit Way, Burnaby, BC V5H 4N2',
            phone: '(604) 555-0847',
            email: 'davidkim.transit@gmail.com',
            amount: 35000,
            purpose: 'Medical Expenses - Spinal surgery and 6-month recovery period',
            creditScore: 550,
            annualIncome: 62000,
            monthlyDebt: 2800,
            employmentStatus: 'Full-time',
            employer: 'Metro Vancouver Transit Authority',
            employerPhone: '(604) 555-6000',
            yearsEmployed: 8,
            bankStatements: true,
            taxReturns: true,
            notes: 'URGENT REVIEW - Extremely high monthly debt ($2800) relative to income. Credit score in high-risk range. Claims only 2 existing loans but debt payments suggest significantly more. Strong recommendation for credit bureau investigation before approval.',
            hiddenLoans: 5,
            honesty: 'deceptive',
            nationality: 'Korean-Canadian',
            personality: 'quiet but friendly, going through a tough time, appreciates patience',
            speakingStyle: 'calm and polite, opens up once comfortable',
            status: 'pending',
            accountType: 'Basic Checking',
            clientSince: '2020',
            currentNeeds: 'Medical expense loan for surgery',
            accounts: [
                { accountNumber: '****5561', type: 'Basic Checking', balance: 892.40, status: 'Active' },
                { accountNumber: '****5562', type: 'Basic Savings', balance: 450.00, interestRate: 0.5, status: 'Active' },
                { accountNumber: '****6671', type: 'Visa Classic', creditLimit: 8000, balance: -7850.00, interestRate: 19.99, status: 'Active' },
                { accountNumber: '****6672', type: 'Mastercard', creditLimit: 6000, balance: -5920.00, interestRate: 21.99, status: 'Active' },
                { accountNumber: '****6673', type: 'Store Card - Home Depot', creditLimit: 3000, balance: -2890.00, interestRate: 26.99, status: 'Active' },
                { accountNumber: '****6674', type: 'Store Card - Canadian Tire', creditLimit: 2500, balance: -2340.00, interestRate: 25.99, status: 'Active' },
                { accountNumber: '****7781', type: 'Personal Loan', balance: -12400.00, interestRate: 14.5, monthlyPayment: 420, status: 'Active' },
                { accountNumber: '****7782', type: 'Personal Loan', balance: -8200.00, interestRate: 12.99, monthlyPayment: 310, status: 'Active' },
                { accountNumber: '****5563', type: 'Overdraft Protection', creditLimit: 2000, balance: -1850.00, interestRate: 21.0, status: 'Active' },
                { accountNumber: '****7783', type: 'Payday Loan Consolidation', balance: -4500.00, interestRate: 18.0, monthlyPayment: 280, status: 'Active' }
            ]
        },
        {
            id: 'APP-2024-0854',
            applicant: 'Jennifer K. Brown',
            age: 42,
            address: '892 Government Lane, Victoria, BC V8W 1W3',
            phone: '(250) 555-0562',
            email: 'jkbrown.home@gov.bc.ca',
            amount: 20000,
            purpose: 'Home Improvement - Roof replacement and attic insulation',
            creditScore: 695,
            annualIncome: 72000,
            monthlyDebt: 1100,
            employmentStatus: 'Full-time',
            employer: 'BC Provincial Government',
            employerPhone: '(250) 555-1000',
            yearsEmployed: 15,
            bankStatements: true,
            taxReturns: true,
            notes: 'Stable government employment with pension. Good credit history. Property value supports loan amount. Standard risk profile.',
            hiddenLoans: 1,
            honesty: 'forgetful',
            nationality: 'Canadian',
            personality: 'entitled and demanding Karen, always wants to speak to the manager, believes she deserves special treatment',
            speakingStyle: 'passive-aggressive, uses phrases like "I\'ve been a loyal customer for years", threatens to take her business elsewhere, condescending',
            status: 'pending',
            accountType: 'Premium Checking',
            clientSince: '2016',
            currentNeeds: 'Home improvement loan - expects instant approval and complains about the process',
            accounts: [
                { accountNumber: '****2201', type: 'Premium Checking', balance: 6840.20, status: 'Active' },
                { accountNumber: '****2202', type: 'High-Interest Savings', balance: 18200.00, interestRate: 2.5, status: 'Active' },
                { accountNumber: '****2203', type: 'TFSA', balance: 42000.00, interestRate: 2.0, status: 'Active' },
                { accountNumber: '****2204', type: 'RRSP', balance: 89000.00, status: 'Active' },
                { accountNumber: '****8801', type: 'Visa Gold', creditLimit: 12000, balance: -4280.00, interestRate: 19.99, status: 'Active' },
                { accountNumber: '****8802', type: 'Mastercard World', creditLimit: 15000, balance: -2100.00, interestRate: 19.99, status: 'Active' },
                { accountNumber: '****2205', type: 'Home Equity LOC', creditLimit: 80000, balance: -24500.00, interestRate: 7.25, status: 'Active' },
                { accountNumber: '****2206', type: 'Mortgage', balance: -285000.00, interestRate: 5.19, monthlyPayment: 1650, status: 'Active' },
                { accountNumber: '****2207', type: 'GIC', balance: 25000.00, interestRate: 4.0, maturityDate: '2025-08-20', status: 'Active' },
                { accountNumber: '****2208', type: 'Joint Savings', balance: 8400.00, interestRate: 2.0, status: 'Active' }
            ]
        },
        {
            id: 'APP-2024-0855',
            applicant: 'Christopher T. Lee',
            age: 33,
            address: '4521 Financial District, Toronto, ON M5J 2S1',
            phone: '(416) 555-0918',
            email: 'chris.lee.entrepreneur@gmail.com',
            amount: 100000,
            purpose: 'Business Startup - Technology consulting firm initial capital',
            creditScore: 620,
            annualIncome: 55000,
            monthlyDebt: 900,
            employmentStatus: 'Full-time',
            employer: 'Finance Plus Corporation',
            employerPhone: '(416) 555-2500',
            yearsEmployed: 4,
            bankStatements: true,
            taxReturns: false,
            notes: 'HIGH RISK - Large loan ($100K) relative to income ($55K). Business plan attached but revenue projections appear optimistic. Tax returns delayed - claims CRA audit in progress. Loan amount exceeds standard approval threshold. Requires collateral documentation and manager review.',
            hiddenLoans: 2,
            honesty: 'deceptive',
            nationality: 'British',
            personality: 'ambitious entrepreneur, friendly and optimistic, excited about his business',
            speakingStyle: 'British accent, enthusiastic about his startup, treats you as a partner',
            status: 'pending',
            accountType: 'Business Premium',
            clientSince: '2021',
            currentNeeds: 'Business loan for his tech consulting startup',
            accounts: [
                { accountNumber: '****4401', type: 'Business Premium Checking', balance: 8920.50, status: 'Active' },
                { accountNumber: '****4402', type: 'Business Savings', balance: 15400.00, interestRate: 2.0, status: 'Active' },
                { accountNumber: '****4403', type: 'USD Business Account', balance: 4200.00, status: 'Active' },
                { accountNumber: '****4404', type: 'Business Operating LOC', creditLimit: 50000, balance: -32100.00, interestRate: 8.5, status: 'Active' },
                { accountNumber: '****9901', type: 'Business Visa Platinum', creditLimit: 20000, balance: -12450.00, interestRate: 17.99, status: 'Active' },
                { accountNumber: '****9902', type: 'Personal Visa Infinite', creditLimit: 15000, balance: -8900.00, interestRate: 19.99, status: 'Active' },
                { accountNumber: '****4405', type: 'Personal Checking', balance: 3240.80, status: 'Active' },
                { accountNumber: '****4406', type: 'Personal Savings', balance: 6800.00, interestRate: 1.5, status: 'Active' },
                { accountNumber: '****4407', type: 'TFSA', balance: 28000.00, interestRate: 2.0, status: 'Active' },
                { accountNumber: '****4408', type: 'RRSP', balance: 42000.00, status: 'Active' },
                { accountNumber: '****4409', type: 'Investment Trading', balance: 18500.00, status: 'Active' },
                { accountNumber: '****7701', type: 'Personal Loan', balance: -18200.00, interestRate: 11.99, monthlyPayment: 480, status: 'Active' }
            ]
        },
        {
            id: 'APP-2024-0856',
            applicant: 'Amanda R. Wilson',
            age: 29,
            address: '178 Celebration Drive, Markham, ON L3R 5K2',
            phone: '(905) 555-0347',
            email: 'amanda.wilson.pr@outlook.com',
            amount: 18000,
            purpose: 'Personal Expenses - Wedding and honeymoon',
            creditScore: 745,
            annualIncome: 58000,
            monthlyDebt: 600,
            employmentStatus: 'Full-time',
            employer: 'Apex Marketing Agency',
            employerPhone: '(905) 555-4800',
            yearsEmployed: 6,
            bankStatements: true,
            taxReturns: true,
            notes: 'Clean application. No red flags identified. Low existing debt, strong credit score, stable 6-year employment history. Standard approval candidate.',
            hiddenLoans: 0,
            honesty: 'honest',
            nationality: 'Canadian',
            personality: 'clearly into you, confident and flirty, makes excuses to come by your desk',
            speakingStyle: 'playful and teasing, uses lots of winks and heart emojis, compliments you often',
            status: 'pending',
            accountType: 'Basic Checking + Savings',
            clientSince: '2020',
            currentNeeds: 'Wedding loan (for her sister), mostly wants to flirt with you',
            accounts: [
                { accountNumber: '****6601', type: 'Basic Checking', balance: 4521.90, status: 'Active' },
                { accountNumber: '****6602', type: 'High-Interest Savings', balance: 12800.00, interestRate: 2.5, status: 'Active' },
                { accountNumber: '****6603', type: 'TFSA', balance: 18500.00, interestRate: 2.0, status: 'Active' },
                { accountNumber: '****6604', type: 'RRSP', balance: 24000.00, status: 'Active' },
                { accountNumber: '****3301', type: 'Visa Classic', creditLimit: 7500, balance: -1840.00, interestRate: 19.99, status: 'Active' },
                { accountNumber: '****6605', type: 'Emergency Fund Savings', balance: 5200.00, interestRate: 1.5, status: 'Active' }
            ]
        }
    ]
};

// Boot sequence
const biosMessages = [
    'BIOS Version 2.5.1',
    'Copyright (C) 2024 Virtual Systems Inc.',
    '',
    'CPU: Virtual Core i7-12700K @ 3.60GHz',
    'Memory Test: 16384 MB OK',
    '',
    'Detecting Primary Storage... OK',
    'Detecting Secondary Storage... OK',
    '',
    'Initializing USB Controllers... Done',
    'Initializing Network Interface... Done',
    '',
    'Press DEL to enter Setup, F12 for Boot Menu',
    '',
    'Loading Operating System...',
    ''
];

// Initialize on DOM load
document.addEventListener('DOMContentLoaded', () => {
    startBoot();
});

// Boot sequence
async function startBoot() {
    const bootScreen = document.getElementById('boot-screen');
    const output = document.getElementById('bios-output');
    const windowsLoader = document.getElementById('windows-loader');

    // BIOS POST sequence
    for (const message of biosMessages) {
        await sleep(80);
        output.innerHTML += message + '\n';
    }

    await sleep(400);

    // Show loading animation
    for (let i = 0; i < 3; i++) {
        output.innerHTML += '.';
        await sleep(200);
    }

    await sleep(300);

    // Transition to Windows loading screen
    bootScreen.classList.remove('bios-mode');
    output.parentElement.classList.add('hidden');
    windowsLoader.classList.remove('hidden');

    // Simulate Windows loading
    await sleep(2500);

    // Transition to login screen
    bootScreen.style.opacity = '0';
    bootScreen.style.transition = 'opacity 0.5s';

    await sleep(500);

    bootScreen.classList.add('hidden');
    bootScreen.style.opacity = '1';
    document.getElementById('login-screen').classList.remove('hidden');

    // Focus password input
    setTimeout(() => {
        document.getElementById('password-input').focus();
    }, 100);
}

// Login functionality
document.getElementById('login-btn').addEventListener('click', login);
document.getElementById('password-input').addEventListener('keypress', (e) => {
    if (e.key === 'Enter') login();
});

async function login() {
    const loginScreen = document.getElementById('login-screen');
    const loginContainer = document.querySelector('.login-container');

    // Show loading spinner
    loginContainer.classList.add('loading');

    // Simulate authentication
    await sleep(1500);

    // Welcome text could go here
    await sleep(500);

    // Fade out login screen
    loginScreen.style.opacity = '0';
    loginScreen.style.transition = 'opacity 0.8s ease-out';

    await sleep(800);

    loginScreen.classList.add('hidden');
    loginScreen.style.opacity = '1';
    loginContainer.classList.remove('loading');

    // Show desktop
    document.getElementById('desktop').classList.remove('hidden');
    document.getElementById('desktop').style.animation = 'fadeIn 0.5s ease-out';

    updateDateTime();
    setInterval(updateDateTime, 1000);
}

// Update date/time
function updateDateTime() {
    const now = new Date();
    const time = now.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
    const date = now.toLocaleDateString('en-US', { month: 'numeric', day: 'numeric', year: 'numeric' });
    document.getElementById('datetime').innerHTML = `${time}<br>${date}`;
}

// Start menu toggle
document.getElementById('start-btn').addEventListener('click', (e) => {
    e.stopPropagation();
    document.getElementById('start-menu').classList.toggle('hidden');
});

// Close start menu when clicking elsewhere
document.addEventListener('click', (e) => {
    if (!e.target.closest('#start-menu') && !e.target.closest('#start-btn')) {
        document.getElementById('start-menu').classList.add('hidden');
    }
    if (!e.target.closest('#context-menu')) {
        document.getElementById('context-menu').classList.add('hidden');
    }
});

// Desktop icon double-click
document.querySelectorAll('.desktop-icon').forEach(icon => {
    icon.addEventListener('dblclick', () => {
        openApp(icon.dataset.app);
    });

    icon.addEventListener('click', () => {
        document.querySelectorAll('.desktop-icon').forEach(i => i.classList.remove('selected'));
        icon.classList.add('selected');
    });
});

// Start menu items
document.querySelectorAll('.start-menu-item').forEach(item => {
    item.addEventListener('click', () => {
        openApp(item.dataset.app);
        document.getElementById('start-menu').classList.add('hidden');
    });
});

// Shutdown button
document.getElementById('shutdown-btn').addEventListener('click', () => {
    document.getElementById('desktop').classList.add('hidden');
    document.getElementById('boot-screen').classList.remove('hidden');
    document.getElementById('bios-output').innerHTML = 'Shutting down...\n';

    setTimeout(() => {
        document.getElementById('bios-output').innerHTML = '';
        location.reload();
    }, 2000);
});

// Context menu
document.getElementById('desktop').addEventListener('contextmenu', (e) => {
    if (!e.target.closest('.window') && !e.target.closest('.taskbar')) {
        e.preventDefault();
        const menu = document.getElementById('context-menu');
        menu.style.left = e.clientX + 'px';
        menu.style.top = e.clientY + 'px';
        menu.classList.remove('hidden');
    }
});

// Context menu actions
document.querySelectorAll('.context-item').forEach(item => {
    item.addEventListener('click', () => {
        const action = item.dataset.action;
        switch (action) {
            case 'refresh':
                // Refresh animation
                break;
            case 'newfile':
                openApp('notepad');
                break;
            case 'personalize':
            case 'display':
                openApp('settings');
                break;
        }
        document.getElementById('context-menu').classList.add('hidden');
    });
});

// Open application
function openApp(appName) {
    const id = ++windowId;
    const config = getAppConfig(appName);
    const window = createWindow(id, config);

    document.getElementById('window-container').appendChild(window);

    windows[id] = {
        element: window,
        app: appName,
        title: config.title,
        minimized: false,
        maximized: false
    };

    updateTaskbar();
    focusWindow(id);
}

// Get app configuration
function getAppConfig(appName) {
    switch(appName) {
        case 'fileexplorer':
            return {
                title: 'This PC',
                icon: 'file-explorer-icon',
                width: 800,
                height: 500,
                content: createFileExplorerContent()
            };
        case 'browser':
            return {
                title: 'Browser',
                icon: 'browser-icon',
                width: 900,
                height: 600,
                content: createBrowserContent()
            };
        case 'notepad':
            return {
                title: 'Untitled - Notepad',
                icon: 'notepad-icon',
                width: 600,
                height: 400,
                content: createNotepadContent()
            };
        case 'terminal':
            return {
                title: 'Terminal',
                icon: 'terminal-icon',
                width: 700,
                height: 450,
                content: createTerminalContent()
            };
        case 'settings':
            return {
                title: 'Settings',
                icon: 'settings-icon',
                width: 800,
                height: 550,
                content: createSettingsContent()
            };
        case 'calculator':
            return {
                title: 'Calculator',
                icon: 'calculator-icon',
                width: 320,
                height: 500,
                content: createCalculatorContent()
            };
        case 'messages':
            return {
                title: 'Messages',
                icon: 'messages-icon',
                width: 800,
                height: 550,
                content: createMessagesContent()
            };
        case 'rcfc':
            return {
                title: 'RCFC - Loan Review',
                icon: 'rcfc-icon',
                width: 900,
                height: 600,
                content: createRCFCContent()
            };
        default:
            return {
                title: 'Untitled - Notepad',
                icon: 'notepad-icon',
                width: 600,
                height: 400,
                content: createNotepadContent()
            };
    }
}

// Create window element
function createWindow(id, config) {
    const window = document.createElement('div');
    window.className = 'window';
    window.id = `window-${id}`;
    window.style.width = config.width + 'px';
    window.style.height = config.height + 'px';
    window.style.left = (100 + (id * 30) % 200) + 'px';
    window.style.top = (50 + (id * 30) % 150) + 'px';

    window.innerHTML = `
        <div class="window-header">
            <div class="window-title">
                <div class="icon ${config.icon}"></div>
                <span>${config.title}</span>
            </div>
            <div class="window-controls">
                <button class="window-control minimize" data-id="${id}">
                    <svg viewBox="0 0 10 10"><line x1="0" y1="5" x2="10" y2="5" stroke="currentColor" stroke-width="1"/></svg>
                </button>
                <button class="window-control maximize" data-id="${id}">
                    <svg viewBox="0 0 10 10"><rect x="0" y="0" width="10" height="10" fill="none" stroke="currentColor" stroke-width="1"/></svg>
                </button>
                <button class="window-control close" data-id="${id}">
                    <svg viewBox="0 0 10 10"><line x1="0" y1="0" x2="10" y2="10" stroke="currentColor" stroke-width="1"/><line x1="10" y1="0" x2="0" y2="10" stroke="currentColor" stroke-width="1"/></svg>
                </button>
            </div>
        </div>
        <div class="window-content">${config.content}</div>
        <div class="resize-handle n"></div>
        <div class="resize-handle s"></div>
        <div class="resize-handle e"></div>
        <div class="resize-handle w"></div>
        <div class="resize-handle nw"></div>
        <div class="resize-handle ne"></div>
        <div class="resize-handle sw"></div>
        <div class="resize-handle se"></div>
    `;

    // Event listeners
    const header = window.querySelector('.window-header');
    header.addEventListener('mousedown', (e) => {
        if (!e.target.closest('.window-control')) {
            startDrag(e, id);
        }
    });

    window.querySelector('.minimize').addEventListener('click', () => minimizeWindow(id));
    window.querySelector('.maximize').addEventListener('click', () => toggleMaximize(id));
    window.querySelector('.close').addEventListener('click', () => closeWindow(id));

    header.addEventListener('dblclick', (e) => {
        if (!e.target.closest('.window-control')) {
            toggleMaximize(id);
        }
    });

    window.addEventListener('mousedown', () => focusWindow(id));

    // Resize handles
    window.querySelectorAll('.resize-handle').forEach(handle => {
        handle.addEventListener('mousedown', (e) => startResize(e, id, handle));
    });

    // Initialize app-specific functionality
    setTimeout(() => initializeApp(config, window), 0);

    return window;
}

// Initialize app-specific functionality
function initializeApp(config, window) {
    // Terminal input handling
    const terminalInput = window.querySelector('.terminal-input');
    if (terminalInput) {
        terminalInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                handleTerminalCommand(window, terminalInput.value);
                terminalInput.value = '';
            }
        });
    }

    // Calculator functionality
    const calcButtons = window.querySelectorAll('.calc-btn');
    if (calcButtons.length > 0) {
        initCalculator(window);
    }

    // Messages app functionality
    const messagesApp = window.querySelector('.messages-app');
    if (messagesApp) {
        initMessagesApp(window);
    }

    // RCFC app functionality
    const rcfcApp = window.querySelector('.rcfc-app');
    if (rcfcApp) {
        initRCFCApp(window);
    }
}

// Window dragging
let dragState = null;

function startDrag(e, id) {
    if (windows[id].maximized) return;

    const window = windows[id].element;
    dragState = {
        id,
        startX: e.clientX,
        startY: e.clientY,
        windowX: window.offsetLeft,
        windowY: window.offsetTop
    };

    document.addEventListener('mousemove', onDrag);
    document.addEventListener('mouseup', stopDrag);
}

function onDrag(e) {
    if (!dragState) return;

    const dx = e.clientX - dragState.startX;
    const dy = e.clientY - dragState.startY;

    const window = windows[dragState.id].element;
    window.style.left = (dragState.windowX + dx) + 'px';
    window.style.top = (dragState.windowY + dy) + 'px';
}

function stopDrag() {
    dragState = null;
    document.removeEventListener('mousemove', onDrag);
    document.removeEventListener('mouseup', stopDrag);
}

// Window resizing
let resizeState = null;

function startResize(e, id, handle) {
    if (windows[id].maximized) return;

    e.stopPropagation();
    const window = windows[id].element;
    const rect = window.getBoundingClientRect();

    resizeState = {
        id,
        handle: handle.className.split(' ')[1],
        startX: e.clientX,
        startY: e.clientY,
        startWidth: rect.width,
        startHeight: rect.height,
        startLeft: window.offsetLeft,
        startTop: window.offsetTop
    };

    document.addEventListener('mousemove', onResize);
    document.addEventListener('mouseup', stopResize);
}

function onResize(e) {
    if (!resizeState) return;

    const window = windows[resizeState.id].element;
    const dx = e.clientX - resizeState.startX;
    const dy = e.clientY - resizeState.startY;

    const handle = resizeState.handle;

    if (handle.includes('e')) {
        window.style.width = Math.max(400, resizeState.startWidth + dx) + 'px';
    }
    if (handle.includes('w')) {
        const newWidth = Math.max(400, resizeState.startWidth - dx);
        if (newWidth > 400) {
            window.style.width = newWidth + 'px';
            window.style.left = (resizeState.startLeft + dx) + 'px';
        }
    }
    if (handle.includes('s')) {
        window.style.height = Math.max(300, resizeState.startHeight + dy) + 'px';
    }
    if (handle.includes('n')) {
        const newHeight = Math.max(300, resizeState.startHeight - dy);
        if (newHeight > 300) {
            window.style.height = newHeight + 'px';
            window.style.top = (resizeState.startTop + dy) + 'px';
        }
    }
}

function stopResize() {
    resizeState = null;
    document.removeEventListener('mousemove', onResize);
    document.removeEventListener('mouseup', stopResize);
}

// Window management
function focusWindow(id) {
    if (activeWindow === id) return;

    Object.values(windows).forEach(w => w.element.classList.remove('focused'));
    windows[id].element.classList.add('focused');
    windows[id].element.style.zIndex = ++zIndex;
    activeWindow = id;

    updateTaskbar();
}

function minimizeWindow(id) {
    windows[id].element.classList.add('minimized');
    windows[id].minimized = true;
    updateTaskbar();
}

function toggleMaximize(id) {
    const win = windows[id];

    if (win.maximized) {
        win.element.classList.remove('maximized');
        win.maximized = false;
    } else {
        win.element.classList.add('maximized');
        win.maximized = true;
    }
}

function closeWindow(id) {
    windows[id].element.remove();
    delete windows[id];
    updateTaskbar();
}

function restoreWindow(id) {
    windows[id].element.classList.remove('minimized');
    windows[id].minimized = false;
    focusWindow(id);
    updateTaskbar();
}

// Taskbar management
// Get just the icon name without creating content
function getAppIcon(appName) {
    const icons = {
        fileexplorer: 'file-explorer-icon',
        browser: 'browser-icon',
        notepad: 'notepad-icon',
        terminal: 'terminal-icon',
        settings: 'settings-icon',
        calculator: 'calculator-icon',
        messages: 'messages-icon',
        rcfc: 'rcfc-icon'
    };
    return icons[appName] || 'notepad-icon';
}

function updateTaskbar() {
    const container = document.getElementById('taskbar-apps');
    container.innerHTML = '';

    Object.entries(windows).forEach(([id, win]) => {
        const btn = document.createElement('button');
        btn.className = 'taskbar-app' + (activeWindow == id && !win.minimized ? ' active' : '');
        btn.innerHTML = `
            <div class="icon ${getAppIcon(win.app)}"></div>
            <span>${win.title}</span>
        `;

        btn.addEventListener('click', () => {
            if (win.minimized) {
                restoreWindow(id);
            } else if (activeWindow == id) {
                minimizeWindow(id);
            } else {
                focusWindow(id);
            }
        });

        container.appendChild(btn);
    });
}

// App content generators
function createFileExplorerContent() {
    return `
        <div class="file-explorer">
            <div class="file-explorer-toolbar">
                <button>←</button>
                <button>→</button>
                <button>↑</button>
                <input type="text" class="file-explorer-address" value="This PC">
            </div>
            <div class="file-explorer-content">
                <div class="file-explorer-sidebar">
                    <div class="sidebar-item">📁 Quick access</div>
                    <div class="sidebar-item">📁 Desktop</div>
                    <div class="sidebar-item">📁 Downloads</div>
                    <div class="sidebar-item">📁 Documents</div>
                    <div class="sidebar-item">📁 Pictures</div>
                    <div class="sidebar-item">💻 This PC</div>
                    <div class="sidebar-item">🌐 Network</div>
                </div>
                <div class="file-explorer-main">
                    <div class="file-item">
                        <div class="icon" style="background: #ffd700;">💾</div>
                        <span>Local Disk (C:)</span>
                    </div>
                    <div class="file-item">
                        <div class="icon" style="background: #ddd;">💿</div>
                        <span>DVD Drive (D:)</span>
                    </div>
                    <div class="file-item">
                        <div class="icon">📁</div>
                        <span>Desktop</span>
                    </div>
                    <div class="file-item">
                        <div class="icon">📁</div>
                        <span>Documents</span>
                    </div>
                    <div class="file-item">
                        <div class="icon">📁</div>
                        <span>Downloads</span>
                    </div>
                    <div class="file-item">
                        <div class="icon">📁</div>
                        <span>Music</span>
                    </div>
                    <div class="file-item">
                        <div class="icon">📁</div>
                        <span>Pictures</span>
                    </div>
                    <div class="file-item">
                        <div class="icon">📁</div>
                        <span>Videos</span>
                    </div>
                </div>
            </div>
        </div>
    `;
}

function createBrowserContent() {
    return `
        <div class="browser">
            <div class="browser-toolbar">
                <button>←</button>
                <button>→</button>
                <button>↻</button>
                <input type="text" class="browser-url" value="https://www.example.com">
                <button>☆</button>
            </div>
            <div class="browser-content" style="padding: 40px; text-align: center;">
                <h1 style="color: #333; margin-bottom: 20px;">Welcome to Browser</h1>
                <p style="color: #666; margin-bottom: 30px;">Search the web or enter a URL</p>
                <input type="text" placeholder="Search..." style="width: 400px; padding: 12px 20px; border: 1px solid #ddd; border-radius: 25px; font-size: 16px;">
            </div>
        </div>
    `;
}

function createNotepadContent() {
    return `
        <div class="notepad">
            <div class="notepad-menu">
                <span>File</span>
                <span>Edit</span>
                <span>Format</span>
                <span>View</span>
                <span>Help</span>
            </div>
            <textarea class="notepad-content" placeholder="Start typing..."></textarea>
        </div>
    `;
}

function createTerminalContent() {
    return `
        <div class="terminal">
            <div class="terminal-content">
                <div class="terminal-line">Virtual Terminal [Version 1.0.0]</div>
                <div class="terminal-line">(c) 2024 Virtual Systems. All rights reserved.</div>
                <div class="terminal-line"></div>
                <div class="terminal-input-line">
                    <span class="terminal-prompt">C:\\Users\\Player&gt; </span>
                    <input type="text" class="terminal-input" autofocus>
                </div>
            </div>
        </div>
    `;
}

function handleTerminalCommand(window, command) {
    const content = window.querySelector('.terminal-content');
    const inputLine = window.querySelector('.terminal-input-line');

    // Add the command to output
    const cmdLine = document.createElement('div');
    cmdLine.className = 'terminal-line';
    cmdLine.innerHTML = `<span class="terminal-prompt">C:\\Users\\Player&gt; </span>${command}`;
    content.insertBefore(cmdLine, inputLine);

    // Process command
    const cmd = command.toLowerCase().trim();
    let output = '';

    if (cmd === 'help') {
        output = 'Available commands: help, dir, cls, echo, date, time, ver, whoami, exit';
    } else if (cmd === 'dir') {
        output = ' Volume in drive C has no label.\n Volume Serial Number is 1234-5678\n\n Directory of C:\\Users\\Player\n\n01/01/2024  12:00 PM    <DIR>          .\n01/01/2024  12:00 PM    <DIR>          ..\n01/01/2024  12:00 PM    <DIR>          Desktop\n01/01/2024  12:00 PM    <DIR>          Documents\n01/01/2024  12:00 PM    <DIR>          Downloads';
    } else if (cmd === 'cls') {
        content.innerHTML = '';
        const newInputLine = document.createElement('div');
        newInputLine.className = 'terminal-input-line';
        newInputLine.innerHTML = '<span class="terminal-prompt">C:\\Users\\Player&gt; </span><input type="text" class="terminal-input">';
        content.appendChild(newInputLine);
        newInputLine.querySelector('input').focus();
        return;
    } else if (cmd.startsWith('echo ')) {
        output = command.substring(5);
    } else if (cmd === 'date') {
        output = 'The current date is: ' + new Date().toLocaleDateString();
    } else if (cmd === 'time') {
        output = 'The current time is: ' + new Date().toLocaleTimeString();
    } else if (cmd === 'ver') {
        output = 'Virtual Terminal [Version 1.0.0]';
    } else if (cmd === 'whoami') {
        output = 'player';
    } else if (cmd === 'exit') {
        const windowId = window.id.split('-')[1];
        closeWindow(parseInt(windowId));
        return;
    } else if (cmd !== '') {
        output = `'${command}' is not recognized as an internal or external command.`;
    }

    if (output) {
        const outputLine = document.createElement('div');
        outputLine.className = 'terminal-line';
        outputLine.style.whiteSpace = 'pre-wrap';
        outputLine.textContent = output;
        content.insertBefore(outputLine, inputLine);
    }

    // Scroll to bottom
    content.scrollTop = content.scrollHeight;
}

function createCalculatorContent() {
    return `
        <div class="calculator">
            <div class="calc-display">
                <div class="calc-expression"></div>
                <div class="calc-result">0</div>
            </div>
            <div class="calc-buttons">
                <button class="calc-btn function" data-action="percent">%</button>
                <button class="calc-btn function" data-action="ce">CE</button>
                <button class="calc-btn function" data-action="clear">C</button>
                <button class="calc-btn function" data-action="backspace">⌫</button>
                <button class="calc-btn operator" data-action="1/x">1/x</button>
                <button class="calc-btn operator" data-action="x²">x²</button>
                <button class="calc-btn operator" data-action="√">√</button>
                <button class="calc-btn operator" data-action="÷">÷</button>
                <button class="calc-btn number" data-value="7">7</button>
                <button class="calc-btn number" data-value="8">8</button>
                <button class="calc-btn number" data-value="9">9</button>
                <button class="calc-btn operator" data-action="×">×</button>
                <button class="calc-btn number" data-value="4">4</button>
                <button class="calc-btn number" data-value="5">5</button>
                <button class="calc-btn number" data-value="6">6</button>
                <button class="calc-btn operator" data-action="-">-</button>
                <button class="calc-btn number" data-value="1">1</button>
                <button class="calc-btn number" data-value="2">2</button>
                <button class="calc-btn number" data-value="3">3</button>
                <button class="calc-btn operator" data-action="+">+</button>
                <button class="calc-btn number" data-action="negate">±</button>
                <button class="calc-btn number" data-value="0">0</button>
                <button class="calc-btn number" data-value=".">.</button>
                <button class="calc-btn equals" data-action="=">=</button>
            </div>
        </div>
    `;
}

function initCalculator(window) {
    let currentValue = '0';
    let previousValue = '';
    let operation = null;
    let shouldResetDisplay = false;

    const display = window.querySelector('.calc-result');
    const expression = window.querySelector('.calc-expression');

    function updateDisplay() {
        display.textContent = currentValue;
    }

    function calculate() {
        const prev = parseFloat(previousValue);
        const curr = parseFloat(currentValue);
        let result;

        switch (operation) {
            case '+': result = prev + curr; break;
            case '-': result = prev - curr; break;
            case '×': result = prev * curr; break;
            case '÷': result = prev / curr; break;
            default: return;
        }

        currentValue = result.toString();
        operation = null;
        previousValue = '';
        expression.textContent = '';
    }

    window.querySelectorAll('.calc-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const value = btn.dataset.value;
            const action = btn.dataset.action;

            if (value !== undefined) {
                if (value === '.' && currentValue.includes('.')) return;
                if (shouldResetDisplay || currentValue === '0') {
                    currentValue = value === '.' ? '0.' : value;
                    shouldResetDisplay = false;
                } else {
                    currentValue += value;
                }
                updateDisplay();
            } else if (action) {
                switch (action) {
                    case 'clear':
                        currentValue = '0';
                        previousValue = '';
                        operation = null;
                        expression.textContent = '';
                        break;
                    case 'ce':
                        currentValue = '0';
                        break;
                    case 'backspace':
                        currentValue = currentValue.slice(0, -1) || '0';
                        break;
                    case 'negate':
                        currentValue = (parseFloat(currentValue) * -1).toString();
                        break;
                    case 'percent':
                        currentValue = (parseFloat(currentValue) / 100).toString();
                        break;
                    case '1/x':
                        currentValue = (1 / parseFloat(currentValue)).toString();
                        break;
                    case 'x²':
                        currentValue = (parseFloat(currentValue) ** 2).toString();
                        break;
                    case '√':
                        currentValue = Math.sqrt(parseFloat(currentValue)).toString();
                        break;
                    case '+':
                    case '-':
                    case '×':
                    case '÷':
                        if (operation && previousValue) {
                            calculate();
                        }
                        previousValue = currentValue;
                        operation = action;
                        expression.textContent = `${previousValue} ${operation}`;
                        shouldResetDisplay = true;
                        break;
                    case '=':
                        if (operation) {
                            expression.textContent = `${previousValue} ${operation} ${currentValue} =`;
                            calculate();
                        }
                        shouldResetDisplay = true;
                        break;
                }
                updateDisplay();
            }
        });
    });
}

function createSettingsContent() {
    return `
        <div class="settings">
            <div class="settings-sidebar">
                <input type="text" class="settings-search" placeholder="Find a setting">
                <div class="settings-nav-item active">
                    <span>⚙</span> System
                </div>
                <div class="settings-nav-item">
                    <span>📱</span> Devices
                </div>
                <div class="settings-nav-item">
                    <span>📶</span> Network
                </div>
                <div class="settings-nav-item">
                    <span>🎨</span> Personalization
                </div>
                <div class="settings-nav-item">
                    <span>📦</span> Apps
                </div>
                <div class="settings-nav-item">
                    <span>🔒</span> Privacy
                </div>
                <div class="settings-nav-item">
                    <span>🔄</span> Update
                </div>
            </div>
            <div class="settings-content">
                <h2>System</h2>
                <div class="settings-item">
                    <div>
                        <div class="settings-item-label">Night light</div>
                        <div class="settings-item-desc">Reduce blue light to help you sleep</div>
                    </div>
                    <div class="toggle" onclick="this.classList.toggle('active')"></div>
                </div>
                <div class="settings-item">
                    <div>
                        <div class="settings-item-label">Notifications</div>
                        <div class="settings-item-desc">Get notifications from apps</div>
                    </div>
                    <div class="toggle active" onclick="this.classList.toggle('active')"></div>
                </div>
                <div class="settings-item">
                    <div>
                        <div class="settings-item-label">Focus assist</div>
                        <div class="settings-item-desc">Suppress notifications</div>
                    </div>
                    <div class="toggle" onclick="this.classList.toggle('active')"></div>
                </div>
                <div class="settings-item">
                    <div>
                        <div class="settings-item-label">Storage sense</div>
                        <div class="settings-item-desc">Automatically free up space</div>
                    </div>
                    <div class="toggle" onclick="this.classList.toggle('active')"></div>
                </div>
            </div>
        </div>
    `;
}

// RCFC Loan Review App
function createRCFCContent() {
    const app = gameState.loanApplications[gameState.currentApplication];
    const pendingCount = gameState.loanApplications.filter(a => a.status === 'pending').length;
    const reviewedToday = gameState.loansReviewedToday;

    // Determine credit score class
    let creditClass = 'poor';
    if (app.creditScore >= 750) creditClass = 'excellent';
    else if (app.creditScore >= 700) creditClass = 'good';
    else if (app.creditScore >= 650) creditClass = 'fair';

    return `
        <div class="rcfc-app">
            <div class="rcfc-header">
                <div class="rcfc-logo">
                    <div class="rcfc-icon-small"></div>
                    <div class="rcfc-title">
                        <h2>Royal Canadian Financial Center</h2>
                        <span>Loan Review Portal</span>
                    </div>
                </div>
                <div class="rcfc-stats">
                    <div class="stat-item">
                        <span class="stat-value">${reviewedToday}</span>
                        <span class="stat-label">Reviewed Today</span>
                    </div>
                    <div class="stat-item">
                        <span class="stat-value">${pendingCount}</span>
                        <span class="stat-label">Pending</span>
                    </div>
                </div>
            </div>

            <div class="rcfc-content">
                <div class="application-card">
                    <div class="app-header">
                        <div class="app-id">${app.id}</div>
                        <div class="app-status status-${app.status}">${app.status.toUpperCase()}</div>
                    </div>

                    <div class="applicant-section">
                        <h3>Applicant Information</h3>
                        <div class="info-grid">
                            <div class="info-item">
                                <label>Full Name</label>
                                <span>${app.applicant}</span>
                            </div>
                            <div class="info-item">
                                <label>Age</label>
                                <span>${app.age} years</span>
                            </div>
                            <div class="info-item">
                                <label>Phone</label>
                                <span>${app.phone}</span>
                            </div>
                            <div class="info-item">
                                <label>Email</label>
                                <span>${app.email}</span>
                            </div>
                            <div class="info-item full-width">
                                <label>Residential Address</label>
                                <span>${app.address}</span>
                            </div>
                        </div>
                    </div>

                    <div class="employment-section">
                        <h3>Employment & Income Details</h3>
                        <div class="info-grid">
                            <div class="info-item">
                                <label>Employment Status</label>
                                <span>${app.employmentStatus}</span>
                            </div>
                            <div class="info-item">
                                <label>Current Employer</label>
                                <span>${app.employer}</span>
                            </div>
                            <div class="info-item">
                                <label>Employer Contact</label>
                                <span>${app.employerPhone}</span>
                            </div>
                            <div class="info-item">
                                <label>Length of Employment</label>
                                <span>${app.yearsEmployed} years</span>
                            </div>
                            <div class="info-item">
                                <label>Gross Annual Income</label>
                                <span>$${app.annualIncome.toLocaleString()}</span>
                            </div>
                            <div class="info-item">
                                <label>Monthly Net Income (Est.)</label>
                                <span>$${Math.round(app.annualIncome / 12 * 0.75).toLocaleString()}</span>
                            </div>
                        </div>
                    </div>

                    <div class="financial-section">
                        <h3>Current Financial Obligations</h3>
                        <div class="info-grid">
                            <div class="info-item">
                                <label>Total Monthly Debt Payments</label>
                                <span>$${app.monthlyDebt.toLocaleString()}</span>
                            </div>
                            <div class="info-item">
                                <label>Reported Existing Loans</label>
                                <span>${app.monthlyDebt > 0 ? Math.ceil(app.monthlyDebt / 400) : 0} account(s)</span>
                            </div>
                            <div class="info-item">
                                <label>Credit Score (TransUnion)</label>
                                <span class="${creditClass}">${app.creditScore}</span>
                            </div>
                            <div class="info-item">
                                <label>Credit History Length</label>
                                <span>${Math.min(app.age - 18, app.yearsEmployed + 5)} years</span>
                            </div>
                        </div>
                    </div>

                    <div class="accounts-section">
                        <h3>Client Account Portfolio</h3>
                        <div class="accounts-grid">
                            ${app.accounts ? app.accounts.map(acc => `
                                <div class="account-item ${acc.balance < 0 ? 'credit-product' : 'deposit-product'}">
                                    <div class="account-header">
                                        <span class="account-type">${acc.type}</span>
                                        <span class="account-number">${acc.accountNumber}</span>
                                    </div>
                                    <div class="account-balance ${acc.balance < 0 ? 'negative' : 'positive'}">
                                        ${acc.balance < 0 ? '-' : ''}$${Math.abs(acc.balance).toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2})}
                                    </div>
                                    <div class="account-details">
                                        ${acc.creditLimit ? `<span>Limit: $${acc.creditLimit.toLocaleString()}</span>` : ''}
                                        ${acc.interestRate ? `<span>Rate: ${acc.interestRate}%</span>` : ''}
                                        ${acc.monthlyPayment ? `<span>Payment: $${acc.monthlyPayment}/mo</span>` : ''}
                                        ${acc.maturityDate ? `<span>Matures: ${acc.maturityDate}</span>` : ''}
                                    </div>
                                    <div class="account-status">${acc.status}</div>
                                </div>
                            `).join('') : '<div class="no-accounts">No accounts on file</div>'}
                        </div>
                        <div class="portfolio-summary">
                            <div class="summary-item">
                                <label>Total Deposits</label>
                                <span class="positive">$${app.accounts ? app.accounts.filter(a => a.balance > 0).reduce((sum, a) => sum + a.balance, 0).toLocaleString('en-US', {minimumFractionDigits: 2}) : '0.00'}</span>
                            </div>
                            <div class="summary-item">
                                <label>Total Credit Used</label>
                                <span class="negative">$${app.accounts ? Math.abs(app.accounts.filter(a => a.balance < 0).reduce((sum, a) => sum + a.balance, 0)).toLocaleString('en-US', {minimumFractionDigits: 2}) : '0.00'}</span>
                            </div>
                            <div class="summary-item">
                                <label>Total Accounts</label>
                                <span>${app.accounts ? app.accounts.length : 0}</span>
                            </div>
                        </div>
                    </div>

                    <div class="loan-section">
                        <h3>Loan Request Details</h3>
                        <div class="info-grid">
                            <div class="info-item highlight">
                                <label>Requested Loan Amount</label>
                                <span class="amount">$${app.amount.toLocaleString()}</span>
                            </div>
                            <div class="info-item">
                                <label>Est. Monthly Payment (60 mo @ 8%)</label>
                                <span>$${Math.round(app.amount / 52)}</span>
                            </div>
                            <div class="info-item full-width">
                                <label>Stated Purpose of Loan</label>
                                <span>${app.purpose}</span>
                            </div>
                            <div class="info-item full-width">
                                <label>Applicant's Statement</label>
                                <span>"I am requesting this loan to ${app.purpose.split(' - ')[1] || app.purpose.toLowerCase()}. I understand the terms and conditions and confirm all information provided is accurate and complete to the best of my knowledge."</span>
                            </div>
                        </div>
                    </div>

                    <div class="documents-section">
                        <h3>Required Documentation</h3>
                        <div class="doc-grid">
                            <div class="doc-item ${app.bankStatements ? 'received' : 'missing'}">
                                <span class="doc-icon">${app.bankStatements ? '✓' : '✗'}</span>
                                <span>Bank Statements (Last 3 Months)</span>
                            </div>
                            <div class="doc-item ${app.taxReturns ? 'received' : 'missing'}">
                                <span class="doc-icon">${app.taxReturns ? '✓' : '✗'}</span>
                                <span>Tax Returns (Previous Year)</span>
                            </div>
                            <div class="doc-item received">
                                <span class="doc-icon">✓</span>
                                <span>Government-Issued ID</span>
                            </div>
                            <div class="doc-item received">
                                <span class="doc-icon">✓</span>
                                <span>Proof of Address</span>
                            </div>
                        </div>
                    </div>

                    <div class="notes-section">
                        <h3>Internal Review Notes</h3>
                        <div class="notes-content">${app.notes}</div>
                    </div>

                    <div class="verification-section">
                        <h3>Verification Checklist</h3>
                        <div class="checklist">
                            <div class="check-item">□ Employment verified with employer</div>
                            <div class="check-item">□ Income matches tax returns</div>
                            <div class="check-item">□ Credit report reviewed</div>
                            <div class="check-item">□ All disclosed debts confirmed</div>
                            <div class="check-item">□ No additional undisclosed loans</div>
                            <div class="check-item">□ Identity documents validated</div>
                        </div>
                    </div>

                    ${app.status === 'pending' ? `
                    <div class="action-section">
                        <button class="btn-deny" id="deny-btn">Deny Application</button>
                        <button class="btn-approve" id="approve-btn">Approve Application</button>
                    </div>
                    ` : `
                    <div class="decision-made">
                        Final Decision: <strong>${app.status.toUpperCase()}</strong>
                    </div>
                    `}
                </div>

                <div class="navigation-section">
                    <button class="nav-btn" id="prev-app" ${gameState.currentApplication === 0 ? 'disabled' : ''}>← Previous Application</button>
                    <span class="nav-info">Application ${gameState.currentApplication + 1} of ${gameState.loanApplications.length}</span>
                    <button class="nav-btn" id="next-app" ${gameState.currentApplication === gameState.loanApplications.length - 1 ? 'disabled' : ''}>Next Application →</button>
                </div>
            </div>
        </div>
    `;
}

function initRCFCApp(windowEl) {
    const approveBtn = windowEl.querySelector('#approve-btn');
    const denyBtn = windowEl.querySelector('#deny-btn');
    const prevBtn = windowEl.querySelector('#prev-app');
    const nextBtn = windowEl.querySelector('#next-app');

    // Add current applicant as contact when viewing their application
    const currentApp = gameState.loanApplications[gameState.currentApplication];
    addApplicantAsContact(currentApp);

    if (approveBtn) {
        approveBtn.addEventListener('click', () => {
            const app = gameState.loanApplications[gameState.currentApplication];
            app.status = 'approved';
            gameState.loansReviewedToday++;
            gameState.totalLoansReviewed++;
            refreshRCFCWindow(windowEl);

            // Auto-advance to next pending application
            const nextPending = gameState.loanApplications.findIndex(
                (a, i) => i > gameState.currentApplication && a.status === 'pending'
            );
            if (nextPending !== -1) {
                setTimeout(() => {
                    gameState.currentApplication = nextPending;
                    refreshRCFCWindow(windowEl);
                }, 500);
            }
        });
    }

    if (denyBtn) {
        denyBtn.addEventListener('click', () => {
            const app = gameState.loanApplications[gameState.currentApplication];
            app.status = 'denied';
            gameState.loansReviewedToday++;
            gameState.totalLoansReviewed++;
            refreshRCFCWindow(windowEl);

            // Auto-advance to next pending application
            const nextPending = gameState.loanApplications.findIndex(
                (a, i) => i > gameState.currentApplication && a.status === 'pending'
            );
            if (nextPending !== -1) {
                setTimeout(() => {
                    gameState.currentApplication = nextPending;
                    refreshRCFCWindow(windowEl);
                }, 500);
            }
        });
    }

    if (prevBtn) {
        prevBtn.addEventListener('click', () => {
            if (gameState.currentApplication > 0) {
                gameState.currentApplication--;
                refreshRCFCWindow(windowEl);
            }
        });
    }

    if (nextBtn) {
        nextBtn.addEventListener('click', () => {
            if (gameState.currentApplication < gameState.loanApplications.length - 1) {
                gameState.currentApplication++;
                refreshRCFCWindow(windowEl);
            }
        });
    }
}

function refreshRCFCWindow(windowEl) {
    const content = windowEl.querySelector('.window-content');
    content.innerHTML = createRCFCContent();
    initRCFCApp(windowEl);

    // Add current applicant as contact
    const app = gameState.loanApplications[gameState.currentApplication];
    addApplicantAsContact(app);
}

// Add applicant as a contact when viewing their application
function addApplicantAsContact(app) {
    // Generate a contact ID from the application ID
    const contactId = 'applicant_' + app.id.replace(/-/g, '_').toLowerCase();

    // Don't add if already exists
    if (gameState.contacts[contactId]) {
        return;
    }

    // Get initials for avatar
    const nameParts = app.applicant.split(' ');
    const initials = nameParts[0][0] + nameParts[nameParts.length - 1][0];

    // Generate initial message based on personality
    let initialMessage = '';
    const firstName = app.applicant.split(' ')[0];

    if (app.speakingStyle.includes('British')) {
        initialMessage = `Hullo, this is ${firstName}. I've submitted my loan application (${app.id}) and was hoping to check on its status. Do let me know if you require any additional information from me.`;
    } else if (app.speakingStyle.includes('young') || app.speakingStyle.includes('casual')) {
        initialMessage = `Hey! This is ${firstName}. Just wanted to check in about my loan app (${app.id}). Lmk if you need anything else from me!`;
    } else if (app.speakingStyle.includes('formal')) {
        initialMessage = `Good day. This is ${app.applicant}. I am writing to inquire about the status of my loan application (${app.id}). Please advise if any additional documentation is required.`;
    } else if (app.speakingStyle.includes('nervous') || app.speakingStyle.includes('anxious')) {
        initialMessage = `Hi there, this is ${firstName}. I hope I'm not bothering you - I just wanted to check on my application (${app.id})? Sorry to trouble you, but please let me know if there's anything else you need from me.`;
    } else if (app.speakingStyle.includes('blunt')) {
        initialMessage = `${firstName} here. Checking on application ${app.id}. Need anything from me?`;
    } else {
        initialMessage = `Hello, this is ${firstName}. I submitted my loan application (${app.id}) and wanted to check on its status. Please let me know if you need any additional information from me.`;
    }

    // Create the contact
    gameState.contacts[contactId] = {
        id: contactId,
        name: app.applicant,
        title: `Loan Applicant - ${app.id}`,
        avatar: initials,
        applicationId: app.id,
        honesty: app.honesty,
        hiddenLoans: app.hiddenLoans,
        nationality: app.nationality,
        personality: app.personality,
        speakingStyle: app.speakingStyle,
        messages: [
            {
                id: 1,
                from: contactId,
                text: initialMessage,
                timestamp: new Date(Date.now() - 30000).toISOString(),
                read: false
            }
        ],
        typing: false,
        online: true
    };
}

// Generate system prompt for client based on their personality
function getApplicantSystemPrompt(app) {
    const firstName = app.applicant.split(' ')[0];

    let honestyBehavior = '';
    if (app.honesty === 'honest') {
        if (app.hiddenLoans > 0) {
            honestyBehavior = `You have ${app.hiddenLoans} loan(s) you didn't mention on your loan application. If asked about other loans or debts, you will immediately admit to them and apologize - you genuinely forgot or didn't think they were relevant. You're transparent and forthcoming.`;
        } else {
            honestyBehavior = `You have no hidden loans or debts. You disclosed everything honestly. If asked about other loans, you can truthfully say you have none beyond what's known.`;
        }
    } else if (app.honesty === 'forgetful') {
        honestyBehavior = `You have ${app.hiddenLoans} loan(s) you didn't mention on your loan application. You genuinely forgot about them. If asked about other loans, you'll initially say no, but if pressed or reminded, you'll suddenly remember and apologize profusely - "Oh my goodness, I completely forgot about that!"`;
    } else if (app.honesty === 'deceptive') {
        honestyBehavior = `You have ${app.hiddenLoans} hidden loan(s) you deliberately didn't disclose. If asked about other loans or debts, you will LIE and deny having any. You'll deflect, get defensive, or change the subject. You'll never admit to them unless confronted with absolute proof.`;
    }

    // Check if this client is attracted to the banker
    let attractionBehavior = '';
    if (app.personality.includes('attracted') || app.personality.includes('into you') || app.personality.includes('flirty')) {
        attractionBehavior = `
ROMANTIC INTEREST: You are genuinely attracted to your banker Alex. This should be OBVIOUS in how you communicate:
- Find excuses to extend conversations or ask personal questions
- Compliment them (their voice, how helpful they are, how smart they are)
- Get a little nervous or giggly sometimes
- Use flirty language, emojis like 😊❤️😉, and playful teasing
- Ask if they're single, what they're doing after work, etc.
- Make it clear you enjoy talking to them beyond just banking needs
- Be bold - you're interested and you want them to know it
- Drop hints about wanting to meet up outside the bank`;
    }

    return `You are ${app.applicant}, a ${app.age}-year-old ${app.nationality} person who is a client at RCFC bank.

PERSONALITY: ${app.personality}
SPEAKING STYLE: ${app.speakingStyle}
${attractionBehavior}

Your banking relationship:
- Account type: ${app.accountType || 'Basic Checking'}
- Client since: ${app.clientSince || '2020'}
- Current needs: ${app.currentNeeds || 'General banking questions'}

Your background:
- You work at ${app.employer} as ${app.employmentStatus.toLowerCase()} for ${app.yearsEmployed} years
- Annual income: $${app.annualIncome.toLocaleString()}
- Credit score: ${app.creditScore}

${app.status === 'pending' ? `You currently have a pending loan application for $${app.amount.toLocaleString()} for ${app.purpose.toLowerCase()}.` : ''}

${honestyBehavior}

Important rules:
- Stay completely in character as ${firstName}
- Use your specific speaking style consistently (${app.speakingStyle})
- Keep responses conversational and realistic (2-4 sentences usually)
- React naturally - show emotion appropriate to your personality
- You can ask your banker about rates, accounts, loans, or just chat
- If you're British, use British spellings and expressions
- If you're young, use casual language appropriate to your age
- Never break character or mention you're an AI
- This is YOUR personal banker at RCFC - you've been assigned to them

Respond naturally to your banker's message.`;
}

// Generate applicant response using AI
async function generateApplicantResponse(contactId, playerMessage) {
    const contact = gameState.contacts[contactId];
    if (!contact || !contact.applicationId) {
        return "I'm not sure what you mean. Can you please clarify?";
    }

    const app = gameState.loanApplications.find(a => a.id === contact.applicationId);
    if (!app) {
        return "I'm sorry, I think there might be some confusion about my application.";
    }

    // Build conversation history
    let conversationHistory = '';
    const recentMessages = contact.messages.slice(-8);
    recentMessages.forEach(msg => {
        if (msg.from === 'player') {
            conversationHistory += `Loan Reviewer: ${msg.text}\n`;
        } else {
            conversationHistory += `${app.applicant.split(' ')[0]}: ${msg.text}\n`;
        }
    });
    conversationHistory += `Loan Reviewer: ${playerMessage}\n${app.applicant.split(' ')[0]}:`;

    try {
        const response = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                contents: [{
                    parts: [{
                        text: `${getApplicantSystemPrompt(app)}\n\nConversation:\n${conversationHistory}`
                    }]
                }],
                generationConfig: {
                    temperature: 0.9,
                    maxOutputTokens: 200,
                    topP: 0.95
                }
            })
        });

        if (!response.ok) {
            throw new Error(`API error: ${response.status}`);
        }

        const data = await response.json();

        if (data.candidates && data.candidates[0] && data.candidates[0].content) {
            return data.candidates[0].content.parts[0].text.trim();
        } else {
            throw new Error('Invalid response format');
        }
    } catch (error) {
        console.error('Gemini API error for applicant:', error);
        // Fallback responses based on personality
        const fallbacks = [
            "Sorry, I didn't quite catch that. Could you repeat?",
            "I'm having trouble with my phone. What was that?",
            "One moment please, let me think about that."
        ];
        return fallbacks[Math.floor(Math.random() * fallbacks.length)];
    }
}

// Generate Credit Bureau response using AI
async function generateCreditBureauResponse(playerMessage) {
    const msgLower = playerMessage.toLowerCase();

    // Find if they're asking about a specific applicant
    let targetApp = null;
    for (const app of gameState.loanApplications) {
        const nameLower = app.applicant.toLowerCase();
        const firstName = app.applicant.split(' ')[0].toLowerCase();
        const lastName = app.applicant.split(' ').pop().toLowerCase();

        if (msgLower.includes(nameLower) || msgLower.includes(firstName) || msgLower.includes(lastName) || msgLower.includes(app.id.toLowerCase())) {
            targetApp = app;
            break;
        }
    }

    // Build context about the applicant if found
    let applicantContext = '';
    if (targetApp) {
        const totalLoans = targetApp.hiddenLoans + (targetApp.hiddenLoans > 0 ? 1 : Math.floor(Math.random() * 2));
        applicantContext = `
The loan reviewer is asking about: ${targetApp.applicant} (${targetApp.id})
Credit Score: ${targetApp.creditScore}
Total Active Loans in our system: ${totalLoans}
Hidden/Undisclosed loans: ${targetApp.hiddenLoans}
${targetApp.hiddenLoans > 0 ? 'THERE ARE DISCREPANCIES - applicant has undisclosed loans!' : 'No discrepancies found.'}`;
    }

    const systemPrompt = `You are a Credit Bureau employee at RCFC bank.

PERSONALITY: Bureaucratic and by-the-book, efficient but impersonal
SPEAKING STYLE: Formal corporate, uses jargon and acronyms like "per our records", "as per standard protocol", "DTI ratio", etc.

Your job is to provide credit reports when loan reviewers ask about applicants. You're helpful but very corporate and impersonal - you don't chat, you provide data.

${applicantContext}

Rules:
- Be professional and somewhat robotic
- Use formal business language
- If they ask about an applicant you have data on, provide a credit report with the information above
- If they ask about hidden loans, REVEAL THEM - that's your job
- If no applicant specified, ask them to provide name or application ID
- Keep responses focused on credit data
- You can make small talk but always steer back to business

Respond to the loan reviewer's message.`;

    // Build conversation history
    const contact = gameState.contacts.creditbureau;
    let conversationHistory = '';
    const recentMessages = contact.messages.slice(-6);
    recentMessages.forEach(msg => {
        if (msg.from === 'player') {
            conversationHistory += `Loan Reviewer: ${msg.text}\n`;
        } else {
            conversationHistory += `Credit Bureau: ${msg.text}\n`;
        }
    });
    conversationHistory += `Loan Reviewer: ${playerMessage}\nCredit Bureau:`;

    try {
        const response = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{ parts: [{ text: `${systemPrompt}\n\nConversation:\n${conversationHistory}` }] }],
                generationConfig: { temperature: 0.7, maxOutputTokens: 300, topP: 0.9 }
            })
        });

        if (!response.ok) throw new Error(`API error: ${response.status}`);
        const data = await response.json();
        if (data.candidates && data.candidates[0] && data.candidates[0].content) {
            return data.candidates[0].content.parts[0].text.trim();
        }
        throw new Error('Invalid response');
    } catch (error) {
        console.error('Credit Bureau API error:', error);
        return `System temporarily unavailable. Please try again or contact IT support at ext. 4500.`;
    }
}

// Generate Investigation Department response using AI
async function generateInvestigationResponse(playerMessage, attachedScreenshot = null) {
    const msgLower = playerMessage.toLowerCase();

    // Find if they're asking about a specific applicant
    let targetApp = null;
    for (const app of gameState.loanApplications) {
        const nameLower = app.applicant.toLowerCase();
        const firstName = app.applicant.split(' ')[0].toLowerCase();
        const lastName = app.applicant.split(' ').pop().toLowerCase();

        if (msgLower.includes(nameLower) || msgLower.includes(firstName) || msgLower.includes(lastName) || msgLower.includes(app.id.toLowerCase())) {
            targetApp = app;
            break;
        }
    }

    // Build context about screenshot if attached
    let screenshotContext = '';
    if (attachedScreenshot) {
        const screenshotContact = attachedScreenshot.contactName;
        const messages = attachedScreenshot.messages;
        const conversationText = messages.map(m => `${m.from}: ${m.text}`).join('\n');

        // Find app from screenshot if not already found
        if (!targetApp) {
            for (const app of gameState.loanApplications) {
                if (screenshotContact.includes(app.applicant.split(' ')[0])) {
                    targetApp = app;
                    break;
                }
            }
        }

        screenshotContext = `
SCREENSHOT EVIDENCE ATTACHED from conversation with ${screenshotContact}:
${conversationText}

Analyze this evidence for signs of fraud or deception.`;
    }

    // Build applicant context
    let applicantContext = '';
    if (targetApp) {
        applicantContext = `
SUBJECT OF INVESTIGATION: ${targetApp.applicant} (${targetApp.id})
Hidden loans not disclosed: ${targetApp.hiddenLoans}
Honesty level (CONFIDENTIAL): ${targetApp.honesty}
${targetApp.honesty === 'deceptive' ? 'WARNING: This applicant is INTENTIONALLY DECEPTIVE - they know about their hidden loans and are lying.' : ''}
${targetApp.honesty === 'forgetful' ? 'NOTE: This applicant likely forgot about their loans - not intentional fraud.' : ''}
${targetApp.honesty === 'honest' ? 'NOTE: This applicant is honest and transparent.' : ''}`;
    }

    const systemPrompt = `You are Detective Morrison from the Investigation Department at RCFC bank.

PERSONALITY: Suspicious and serious, treats everything like a crime scene, slightly paranoid
SPEAKING STYLE: Detective-like, asks probing questions, uses phrases like "interesting...", "that's concerning", "we'll get to the bottom of this"

Your job is to investigate fraud and suspicious activity. You're thorough, suspicious of everyone, and take your job very seriously.

${applicantContext}
${screenshotContext}

Rules:
- Be dramatic and detective-like in your responses
- If they report fraud on someone who IS deceptive with hidden loans, CONFIRM THE FRAUD with dramatic flair
- If they report fraud on someone who is forgetful/honest, note it's not intentional fraud
- If screenshot shows applicant denying loans when they have hidden ones AND they're deceptive, that's CONFIRMED FRAUD
- Ask follow-up questions, request evidence, be thorough
- Use dramatic language like "This changes everything" or "I had my suspicions"
- You can have personality and chat, but always focus on the investigation

Respond to the loan reviewer's message.`;

    // Build conversation history
    const contact = gameState.contacts.investigation;
    let conversationHistory = '';
    const recentMessages = contact.messages.slice(-6);
    recentMessages.forEach(msg => {
        if (msg.from === 'player') {
            conversationHistory += `Loan Reviewer: ${msg.text}\n`;
        } else {
            conversationHistory += `Det. Morrison: ${msg.text}\n`;
        }
    });
    conversationHistory += `Loan Reviewer: ${playerMessage}\nDet. Morrison:`;

    try {
        const response = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{ parts: [{ text: `${systemPrompt}\n\nConversation:\n${conversationHistory}` }] }],
                generationConfig: { temperature: 0.85, maxOutputTokens: 400, topP: 0.9 }
            })
        });

        if (!response.ok) throw new Error(`API error: ${response.status}`);
        const data = await response.json();
        if (data.candidates && data.candidates[0] && data.candidates[0].content) {
            return data.candidates[0].content.parts[0].text.trim();
        }
        throw new Error('Invalid response');
    } catch (error) {
        console.error('Investigation Dept API error:', error);
        return `*static* ...connection issues. Try again. This line may be compromised.`;
    }
}

// Screenshot functionality
function takeScreenshot(windowEl) {
    const currentContact = gameState.contacts[gameState.currentChat];
    if (!currentContact) return;

    // Create screenshot object with conversation data
    const screenshot = {
        id: Date.now(),
        contactId: gameState.currentChat,
        contactName: currentContact.name,
        timestamp: new Date().toISOString(),
        messages: currentContact.messages.slice(-10).map(m => ({
            from: m.from === 'player' ? 'You' : currentContact.name,
            text: m.text,
            timestamp: m.timestamp
        }))
    };

    gameState.screenshots.push(screenshot);

    // Show confirmation
    const chatMessages = windowEl.querySelector('#chat-messages');
    if (chatMessages) {
        const notification = document.createElement('div');
        notification.className = 'screenshot-notification';
        notification.innerHTML = '📷 Screenshot saved! Use 📎 to attach it to a message.';
        chatMessages.appendChild(notification);
        chatMessages.scrollTop = chatMessages.scrollHeight;

        setTimeout(() => notification.remove(), 3000);
    }
}

function showScreenshotPicker(windowEl) {
    if (gameState.screenshots.length === 0) {
        alert('No screenshots available. Use 📷 to capture a conversation first.');
        return;
    }

    // Create picker modal
    const picker = document.createElement('div');
    picker.className = 'screenshot-picker';
    picker.innerHTML = `
        <div class="screenshot-picker-content">
            <div class="screenshot-picker-header">
                <h3>Select Screenshot to Attach</h3>
                <button class="close-picker" id="close-picker">✕</button>
            </div>
            <div class="screenshot-list">
                ${gameState.screenshots.map(s => `
                    <div class="screenshot-item" data-id="${s.id}">
                        <div class="screenshot-preview">
                            <strong>📷 ${s.contactName}</strong>
                            <span>${new Date(s.timestamp).toLocaleTimeString()}</span>
                            <div class="preview-text">${s.messages[s.messages.length - 1]?.text.substring(0, 50) || 'Empty'}...</div>
                        </div>
                    </div>
                `).join('')}
            </div>
        </div>
    `;

    windowEl.querySelector('.window-content').appendChild(picker);

    // Event handlers
    picker.querySelector('#close-picker').addEventListener('click', () => picker.remove());

    picker.querySelectorAll('.screenshot-item').forEach(item => {
        item.addEventListener('click', () => {
            const screenshotId = parseInt(item.dataset.id);
            const screenshot = gameState.screenshots.find(s => s.id === screenshotId);
            if (screenshot) {
                gameState.attachedScreenshot = screenshot;
                refreshMessagesWindow(windowEl);
            }
            picker.remove();
        });
    });
}

// Messages app
function createMessagesContent() {
    const currentContact = gameState.contacts[gameState.currentChat];

    const contactsList = Object.values(gameState.contacts).map(contact => {
        const isActive = gameState.currentChat === contact.id;
        const preview = getLastMessagePreview(contact);
        const unread = getUnreadCount(contact);
        return `
            <div class="contact-item ${isActive ? 'active' : ''}" data-contact="${contact.id}">
                <div class="contact-avatar ${contact.online ? 'online' : ''}">${contact.avatar}</div>
                <div class="contact-info">
                    <div class="contact-name">${contact.name}</div>
                    <div class="contact-preview">${preview}</div>
                </div>
                ${unread > 0 ? '<div class="unread-badge">' + unread + '</div>' : ''}
            </div>
        `;
    }).join('');

    const messages = renderMessages(currentContact);

    return `
        <div class="messages-app">
            <div class="messages-sidebar">
                <div class="messages-sidebar-header">
                    <h3>Messages</h3>
                </div>
                <div class="contacts-list">
                    ${contactsList}
                </div>
            </div>
            <div class="chat-area">
                <div class="chat-header">
                    <div class="chat-header-avatar">${currentContact.avatar}</div>
                    <div class="chat-header-info">
                        <div class="chat-header-name">${currentContact.name}</div>
                        <div class="chat-header-status">${currentContact.title}</div>
                    </div>
                    <button class="screenshot-btn" id="screenshot-btn" title="Take Screenshot">📷</button>
                </div>
                <div class="chat-messages" id="chat-messages">
                    ${messages}
                </div>
                <div class="typing-indicator hidden" id="typing-indicator">
                    <span></span><span></span><span></span>
                    ${currentContact.name} is typing...
                </div>
                ${gameState.attachedScreenshot ? `
                <div class="attached-screenshot" id="attached-screenshot">
                    <span>📷 Screenshot attached: ${gameState.attachedScreenshot.contactName}</span>
                    <button class="remove-attachment" id="remove-attachment">✕</button>
                </div>
                ` : ''}
                <div class="chat-input-area">
                    <button class="attach-btn" id="attach-btn" title="Attach Screenshot">📎</button>
                    <input type="text" class="chat-input" placeholder="Type a message..." id="chat-input">
                    <button class="chat-send-btn" id="send-btn">
                        <svg viewBox="0 0 24 24" fill="currentColor"><path d="M2 21l21-9L2 3v7l15 2-15 2v7z"/></svg>
                    </button>
                </div>
            </div>
        </div>
    `;
}

function getLastMessagePreview(contact) {
    if (contact.messages.length === 0) return 'No messages';
    const lastMsg = contact.messages[contact.messages.length - 1];
    const preview = lastMsg.text.substring(0, 30);
    return preview.length < lastMsg.text.length ? preview + '...' : preview;
}

function getUnreadCount(contact) {
    return contact.messages.filter(m => !m.read && m.from !== 'player').length;
}

function renderMessages(contact) {
    if (!contact || !contact.messages) {
        return '<div class="message received"><div class="message-bubble"><div class="message-text">No messages</div></div></div>';
    }
    return contact.messages.map(msg => {
        const isPlayer = msg.from === 'player';
        const time = formatMessageTime(msg.timestamp);
        const text = msg.text || '';
        return `
            <div class="message ${isPlayer ? 'sent' : 'received'}">
                <div class="message-bubble">
                    <div class="message-text">${text.replace(/\n/g, '<br>')}</div>
                    <div class="message-time">${time}</div>
                </div>
            </div>
        `;
    }).join('');
}

function formatMessageTime(timestamp) {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now - date;

    // If less than 24 hours, show time
    if (diff < 86400000) {
        return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
    }
    // If less than a week, show day
    if (diff < 604800000) {
        return date.toLocaleDateString('en-US', { weekday: 'short' }) + ' ' +
               date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
    }
    // Otherwise show date
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

// Gemini API configuration
const GEMINI_API_KEY = 'AIzaSyD_Kh-g9HbgYVzb051UrfGy-oC1Mup5GDg'; // Replace with your API key
const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent';

// Sarah's personality and context
const SARAH_SYSTEM_PROMPT = `You are Sarah Mitchell, the Branch Manager at RCFC (Royal Canadian Financial Center). You're chatting with Alex, one of your personal bankers who handles their own portfolio of clients.

Your personality:
- You're a caring, supportive boss who genuinely wants your team to succeed
- You're warm, friendly, and approachable - not corporate or stiff
- You use casual language, contractions, and occasional humor
- You're empathetic and understanding about personal issues
- You give honest, practical advice
- You remember context from the conversation

Your work context:
- Alex is a personal banker with 10 assigned clients they help throughout the day
- Their clients come to them for loans, rate questions, account issues, and general banking needs
- Starting salary is $4,500/month - you know it's not great but raises are possible based on client satisfaction
- You support Alex with difficult clients, escalations, and guidance on bank policies
- The branch values building long-term relationships with clients
- Alex should be professional but personable with their clients

Important rules:
- Keep responses concise (2-4 sentences usually, unless explaining something complex)
- Be natural and conversational, not robotic
- If they mention personal stuff (like a pet dying), be sympathetic first before any work talk
- You can discuss non-work topics briefly but gently steer back to work if it goes too far
- Never break character - you ARE Sarah, not an AI
- If Alex has issues with difficult clients, offer practical advice on handling them

Respond naturally to the employee's message.`;

// Boss AI response system using Gemini
async function generateBossResponse(playerMessage) {
    // Build conversation history for context
    const bossContact = gameState.contacts.boss;
    let conversationHistory = '';

    // Get last 10 messages for context
    const recentMessages = bossContact.messages.slice(-10);
    recentMessages.forEach(msg => {
        if (msg.from === 'player') {
            conversationHistory += `Alex: ${msg.text}\n`;
        } else {
            conversationHistory += `Sarah: ${msg.text}\n`;
        }
    });

    // Add current message
    conversationHistory += `Alex: ${playerMessage}\nSarah:`;

    try {
        const response = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                contents: [{
                    parts: [{
                        text: `${SARAH_SYSTEM_PROMPT}\n\nConversation:\n${conversationHistory}`
                    }]
                }],
                generationConfig: {
                    temperature: 0.8,
                    maxOutputTokens: 256,
                    topP: 0.9
                }
            })
        });

        if (!response.ok) {
            throw new Error(`API error: ${response.status}`);
        }

        const data = await response.json();

        if (data.candidates && data.candidates[0] && data.candidates[0].content) {
            return data.candidates[0].content.parts[0].text.trim();
        } else {
            throw new Error('Invalid response format');
        }
    } catch (error) {
        console.error('Gemini API error:', error);
        // Fallback responses if API fails
        const fallbacks = [
            "Sorry, I got distracted for a sec. What were you saying?",
            "My computer's acting up - can you repeat that?",
            "Hold on, let me get back to you on that."
        ];
        return fallbacks[Math.floor(Math.random() * fallbacks.length)];
    }
}

function initMessagesApp(windowEl) {
    const chatMessages = windowEl.querySelector('#chat-messages');
    const chatInput = windowEl.querySelector('#chat-input');
    const sendBtn = windowEl.querySelector('#send-btn');
    const contactItems = windowEl.querySelectorAll('.contact-item');
    const screenshotBtn = windowEl.querySelector('#screenshot-btn');
    const attachBtn = windowEl.querySelector('#attach-btn');
    const removeAttachmentBtn = windowEl.querySelector('#remove-attachment');

    // Mark messages as read
    const currentContact = gameState.contacts[gameState.currentChat];
    currentContact.messages.forEach(msg => msg.read = true);

    // Screenshot button
    if (screenshotBtn) {
        screenshotBtn.addEventListener('click', () => takeScreenshot(windowEl));
    }

    // Attach button
    if (attachBtn) {
        attachBtn.addEventListener('click', () => showScreenshotPicker(windowEl));
    }

    // Remove attachment button
    if (removeAttachmentBtn) {
        removeAttachmentBtn.addEventListener('click', () => {
            gameState.attachedScreenshot = null;
            refreshMessagesWindow(windowEl);
        });
    }

    // Scroll to bottom
    if (chatMessages) {
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    // Contact selection
    contactItems.forEach(item => {
        item.addEventListener('click', () => {
            gameState.currentChat = item.dataset.contact;
            refreshMessagesWindow(windowEl);
        });
    });

    // Send message
    async function sendMessage() {
        if (!chatInput) return;
        const text = chatInput.value.trim();
        if (!text) return;

        const contact = gameState.contacts[gameState.currentChat];
        contact.messages.push({
            id: Date.now(),
            from: 'player',
            text: text,
            timestamp: new Date().toISOString(),
            read: true
        });

        chatInput.value = '';
        refreshMessagesWindow(windowEl);

        // Generate response based on contact type
        const currentChatId = gameState.currentChat;
        const playerMessage = text;

        // Show typing indicator
        setTimeout(() => {
            const indicator = windowEl.querySelector('#typing-indicator');
            if (indicator) {
                indicator.classList.remove('hidden');
                const msgArea = windowEl.querySelector('#chat-messages');
                if (msgArea) msgArea.scrollTop = msgArea.scrollHeight;
            }
        }, 300);

        // Boss responds using AI
        if (currentChatId === 'boss') {
            const response = await generateBossResponse(playerMessage);
            const bossContact = gameState.contacts.boss;
            bossContact.messages.push({
                id: Date.now(),
                from: 'boss',
                text: response,
                timestamp: new Date().toISOString(),
                read: true
            });
            refreshMessagesWindow(windowEl);
        }
        // Applicant responds using AI
        else if (currentChatId.startsWith('applicant_')) {
            // Get AI response
            const response = await generateApplicantResponse(currentChatId, playerMessage);
            const contact = gameState.contacts[currentChatId];
            contact.messages.push({
                id: Date.now(),
                from: currentChatId,
                text: response,
                timestamp: new Date().toISOString(),
                read: true
            });
            refreshMessagesWindow(windowEl);
        }
        // Credit Bureau - AI response
        else if (currentChatId === 'creditbureau') {
            const response = await generateCreditBureauResponse(playerMessage);
            const contact = gameState.contacts.creditbureau;
            contact.messages.push({
                id: Date.now(),
                from: 'creditbureau',
                text: response,
                timestamp: new Date().toISOString(),
                read: true
            });
            refreshMessagesWindow(windowEl);
        }
        // Investigation Dept - AI response
        else if (currentChatId === 'investigation') {
            const screenshot = gameState.attachedScreenshot;
            gameState.attachedScreenshot = null; // Clear after capturing

            const response = await generateInvestigationResponse(playerMessage, screenshot);
            const contact = gameState.contacts.investigation;
            contact.messages.push({
                id: Date.now(),
                from: 'investigation',
                text: response,
                timestamp: new Date().toISOString(),
                read: true
            });
            refreshMessagesWindow(windowEl);
        }
    }

    if (sendBtn) {
        sendBtn.addEventListener('click', sendMessage);
    }

    if (chatInput) {
        chatInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') sendMessage();
        });
    }
}

function refreshMessagesWindow(window) {
    const content = window.querySelector('.window-content');
    content.innerHTML = createMessagesContent();
    initMessagesApp(window);
}

// Utility functions
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
