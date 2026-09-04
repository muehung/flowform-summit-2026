export function createTestFormData() {
  return {
    nameX: '測試使用者',
    email: 'test@example.com',
    phone: '0912345678',
    identity: 'devops',
    company: 'FlowForm 科技',
    department: 'rd',
    jobTitle: '前端工程師',
    interests: ['Cybersecurity', 'DevOps'],
    account: `test${Date.now().toString().slice(-8)}`,
    password: 'Test123456',
    passwordConfirm: 'Test123456',
  };
}