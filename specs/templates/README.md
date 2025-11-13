# 📚 PROMPT TEMPLATES - HƯỚNG DẪN SỬ DỤNG

Bộ prompt chuẩn cho development workflow trong dự án KaDongSite.

---

## 📋 Danh Sách Templates

### 1. [PROMPT_FIX_BUG.md](./PROMPT_FIX_BUG.md)
**Mục đích:** Quy trình chuẩn để fix bugs

**Khi nào dùng:**
- Có bug report từ user/testing
- Chart/component không hoạt động đúng
- API trả về lỗi
- Performance issues
- Data không hiển thị

**Các bước chính:**
1. Đọc specs & hiểu requirement
2. Reproduce bug
3. Phân tích root cause
4. Fix bug với defensive coding
5. Update documentation
6. Viết unit tests
7. Viết integration tests
8. Run all tests
9. Manual testing
10. Update CHANGELOG & commit

**Thời gian:** 4-16 hours tùy độ phức tạp

---

### 2. [PROMPT_ENHANCE_FEATURE.md](./PROMPT_ENHANCE_FEATURE.md)
**Mục đích:** Quy trình chuẩn để thêm/enhance features

**Khi nào dùng:**
- Thêm feature mới
- Enhance feature hiện tại
- Thêm configuration options
- Thêm API endpoints
- Thêm UI components

**Các bước chính:**
1. Đọc specs hiện tại
2. Phân tích requirement mới
3. Design solution (DB + API + UI)
4. Update specs
5. Implement changes
6. Update documentation
7. Viết unit tests
8. Viết integration tests
9. Run all tests
10. Manual testing
11. Performance testing
12. Update CHANGELOG & commit

**Thời gian:** 3 days - 4 weeks tùy scope

---

## 🚀 Cách Sử Dụng

### Bước 1: Chọn Template Phù Hợp

```
Có bug? → Dùng PROMPT_FIX_BUG.md
Thêm feature mới? → Dùng PROMPT_ENHANCE_FEATURE.md
```

### Bước 2: Đọc Kỹ Template

- Đọc toàn bộ template trước khi bắt đầu
- Hiểu từng bước và tại sao cần làm
- Note các tools/commands cần dùng

### Bước 3: Follow Checklist

- Mở file template
- Copy checklist vào task tracking tool (hoặc print ra)
- Tick từng bước khi hoàn thành
- Không skip bước nào

### Bước 4: Sử Dụng Prompt Templates

Copy/paste prompt templates vào AI assistant (GitHub Copilot, ChatGPT, etc.) và điền thông tin cụ thể:

**Ví dụ Fix Bug:**
```
TASK: Phân tích bug trong Gold Prices Chart

CONTEXT:
- Feature: Gold Prices Tool
- File specs: specs/specs/06_gold_prices_tool.spec
- File plan: specs/plans/06_gold_prices_tool.plan
- Bug report: Chart không hiển thị biểu đồ giá vàng

ACTION:
1. Đọc specs/specs/06_gold_prices_tool.spec - section "Biểu đồ lịch sử"
2. Đọc specs/plans/06_gold_prices_tool.plan - Phase 1e implementation
3. Expected: Chart hiển thị line graph với data từ API
4. Actual: Chart blank, không render

[Dán prompt template vào đây]
```

### Bước 5: Document & Commit

- Update CHANGELOG.md với summary
- Commit với message format chuẩn
- Create PR với template trong prompt

---

## 📂 Cấu Trúc Templates

```
specs/templates/
├── README.md                     (File này)
├── PROMPT_FIX_BUG.md             (Template fix bugs)
└── PROMPT_ENHANCE_FEATURE.md     (Template enhance features)
```

---

## 💡 Tips & Best Practices

### 1. Luôn Đọc Specs Trước
```
❌ BAD: Đọc code → Fix luôn → Tests fail
✅ GOOD: Đọc specs → Hiểu requirement → Fix đúng → Tests pass
```

### 2. Test Ngay Sau Khi Fix/Implement
```
❌ BAD: Viết code → Commit → Tests sau
✅ GOOD: Viết code → Tests ngay → Commit khi pass
```

### 3. Document Ngay
```
❌ BAD: Code xong → Document sau (và thường quên)
✅ GOOD: Code xong → Document luôn (trong cùng PR)
```

### 4. Defensive Programming
```javascript
// ❌ BAD: Trust data
data.forEach(item => process(item.value))

// ✅ GOOD: Validate everything
if (!data || !Array.isArray(data)) return []
data.forEach(item => {
  if (!item || !item.value) {
    console.warn('Invalid item:', item)
    return
  }
  process(item.value)
})
```

### 5. Meaningful Commits
```
❌ BAD: "fix bug"
✅ GOOD: "fix: gold chart not displaying with empty data

- Added null/empty data validation
- Added time_bucket → period_start fallback
- Coverage: 45% → 85%

Closes #42"
```

---

## 📊 Success Metrics

### Bug Fix
- ✅ Bug resolved và verified
- ✅ No regression (existing tests still pass)
- ✅ Coverage increased
- ✅ No new bugs introduced
- ✅ Performance not degraded

### Feature Enhancement
- ✅ Feature works as designed
- ✅ Meets acceptance criteria
- ✅ Performance benchmarks met
- ✅ Backward compatible
- ✅ User documentation complete

---

## 🔧 Tools Required

### Development
- VS Code / IDE
- Git
- Node.js 18+
- PostgreSQL 13+
- Browser DevTools

### Testing
- Vitest (unit tests)
- Playwright (E2E tests)
- Artillery / k6 (load testing)
- Postman / curl (API testing)

### Documentation
- Markdown editor
- Mermaid (diagrams)

---

## 📝 Examples

### Example 1: Fix Bug (Gold Chart)
**File:** [PROMPT_FIX_BUG.md](./PROMPT_FIX_BUG.md)
**Section:** "Ví dụ thực tế" trong mỗi bước

**Summary:**
- Bug: Chart không hiển thị
- Root causes: 5 validation issues
- Solution: Defensive programming
- Tests: 19 unit + 20 integration
- Time: ~8 hours
- Result: ✅ All tests passing

### Example 2: Enhance Feature (Price Alerts)
**File:** [PROMPT_ENHANCE_FEATURE.md](./PROMPT_ENHANCE_FEATURE.md)
**Section:** "Ví dụ thực tế" trong mỗi bước

**Summary:**
- Feature: Price alert system
- Components: DB + API + Cron + UI
- Tests: 25 unit + 15 integration + 5 E2E
- Time: ~3 weeks
- Result: ✅ 99%+ notification delivery

---

## 🎓 Learning Path

### For Beginners
1. Start with PROMPT_FIX_BUG.md
2. Fix simple bugs (typos, validation errors)
3. Learn defensive programming patterns
4. Practice writing unit tests

### For Intermediate
1. Fix complex bugs (multi-layer issues)
2. Start with PROMPT_ENHANCE_FEATURE.md
3. Implement small features (new components)
4. Learn integration testing

### For Advanced
1. Design large features (multi-phase)
2. Performance optimization
3. Architecture decisions
4. Mentor others using these templates

---

## 🔄 Version History

### v1.0.0 - 2025-11-13
- ✅ Initial release
- ✅ PROMPT_FIX_BUG.md complete
- ✅ PROMPT_ENHANCE_FEATURE.md complete
- ✅ README.md with usage guide

### Future Versions
- [ ] PROMPT_REFACTOR_CODE.md
- [ ] PROMPT_WRITE_TESTS.md
- [ ] PROMPT_PERFORMANCE_OPTIMIZATION.md
- [ ] PROMPT_SECURITY_AUDIT.md

---

## 📞 Support

**Questions?**
- Check specs/INDEX.md for navigation
- Check specs/USAGE_GUIDE.md for detailed workflow
- Check specs/QUICKSTART.md for 10-min guide

**Found Issues?**
- Update template with improvements
- Add more examples
- Share learnings với team

---

## ⭐ Quick Links

- [Project Specs](../INDEX.md)
- [Quick Start Guide](../QUICKSTART.md)
- [Detailed Usage Guide](../USAGE_GUIDE.md)
- [All Specs](../specs/)
- [All Plans](../plans/)
- [All Tasks](../plans/tasks/)

---

**CREATED:** 2025-11-13  
**VERSION:** 1.0.0  
**STATUS:** ✅ Production Ready  
**MAINTAINER:** KaDongSite Team
