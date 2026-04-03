# Sout El Falah: Publishing Forms Specification

This document defines the structure, UX writing, and commercial guidance for all publishing forms on the platform. The goal is to ensure every submission is clear, credible, and highly marketable.

---

## Shared Patterns & Actions

### Action Bar Strategy
All publishing forms use a persistent bottom action bar to maximize conversion and ease of use.
- **Publish (نشر الآن)**: Primary action. Labeled with the specific type (e.g., "نشر العرض الآن"). High-impact visual weight.
- **Save as Draft (حفظ كمسودة)**: Secondary action. Encourages users to start even if they don't have all details yet. Subtle border/text style.
- **Cancel (إلغاء)**: Tertiary action. Return to previous context. Standard outline style.

### Commercial Guidance Strategy
- **FormField Hints**: Used not just for instructions, but for **Motivation**. (e.g., "Clear photos increase trust by 80%").
- **Placeholders**: Used as **Inspiration**. Instead of "Name", use "e.g., Premium Extra Virgin Olive Oil from Sfax".
- **Validation**: Helpful rather than punitive. (e.g., "Adding a description helps buyers decide faster").

---

## 1. Create Listing Form (عرض بيع)

**Purpose**: Enable farmers and suppliers to list their products for sale.
**User Goal**: Find serious buyers quickly and establish trust.
**SUBMISSION QUALITY**: Professional, descriptive, and data-complete.

| Section | Field Name | Type | Req | Label (Arabic) | Placeholder / Example | Commercial / UX Guidance |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **Identity** | Listing Name | Text | Yes | ما الذي تبيعه اليوم؟ | مثال: تمور دقلة النور قبلي "عرجون" | شجّع على ذكر المنطقة والجودة في العنوان. |
| **Identity** | Category | Select | Yes | صنف المنتج | خضروات، فواكه، إلخ | التصنيف الدقيق يضعك أمام المشتري الصحيح. |
| **Commercial** | Quantity | Number | Yes | الكمية الجاهزة للتسليم | 0 | كن صادقاً في الكمية لتجنب إلغاء الطلبات لاحقاً. |
| **Commercial** | Unit | Select | Yes | وحدة القياس | كغ، طن، كيس، إلخ | توحيد القياس يسهل المقارنة للمشتري. |
| **Commercial** | Unit Price | Text | No | السعر المقترح (TND) | 0.00 | الأسعار الواقعية تسرّع الاتفاق. اتركه فارغاً للتفاوض. |
| **Quality** | Description | Multi | No | صف جودة منتجك بالتفصيل | مثال: محصول عضوي، سقي بئر، تم جنيها يدوياً... | هذا هو "حديث البيع" الخاص بك. اذكر المميزات الفريدة. |
| **Quality** | Location | Select | Yes | مكان تواجد المنتج | المنطقة / الولاية | القرب الجغرافي يقلل تكاليف النقل ويزيد الرغبة. |
| **Media** | Images | Files | No | صور واقعية من المزرعة | (حتى 5 صور) | الصور في ضوء النهار الطبيعي تبني ثقة فورية. |

---

## 2. Create Purchase Request Form (طلب شراء)

**Purpose**: Enable buyers to broadcast their needs to farmers.
**User Goal**: Get the best quality and price from multiple suppliers.
**SUBMISSION QUALITY**: Precise, actionable, and clear on logistics.

| Section | Field Name | Type | Req | Label (Arabic) | Placeholder / Example | Commercial / UX Guidance |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **Needs** | Request Name | Text | Yes | ما الذي تبحث عن شرائه؟ | مثال: مطلوب 2 طن بطاطا صنف "سبونتا" | الوضوح في الصنف يجذب المنتجين المتخصصين. |
| **Needs** | Category | Select | Yes | الصنف المطلوب | حبوب، زيوت، إلخ | يساعد في إرسال تنبيهات للفلاحين المناسبين. |
| **Commercial** | Quantity | Number | Yes | الكمية المطلوبة | 0 | حدد أدنى كمية تقبلها لتوسيع خياراتك. |
| **Commercial** | Unit | Select | Yes | وحدة القياس | كغ، طن، إلخ | دقة الوحدة تمنع الأخطاء في عروض الأسعار. |
| **Commercial** | Budget | Text | No | الميزانية التقديرية (TND) | 0.00 | يساعد في تصفية العروض البعيدة عن قدرتك. |
| **Logistics** | Delivery Loc | Select | Yes | أين تريد الاستلام؟ | الولاية المفضل التسليم فيها | عامل حاسم لحساب تكلفة النقل. |
| **Logistics** | Timing | Text | Yes | متى تحتاج البضاعة؟ | مثال: خلال الأسبوع القادم، عاجل... | يساعد الفلاح في ترتيب أولويات الجني والشحن. |
| **Quality** | Description | Multi | No | شروط ومواصفات خاصة | مثال: جودة صنف أول، لا نقبل التالف... | الدقة هنا تجنبك عروضاً غير مناسبة. |

---

## Universal Verification Rules
1. **RTL Integrity**: All text, icons, and layout must flow naturally from right to left.
2. **Visual Hierarchy**: Required fields must be clearly marked, but without cluttering the UI.
3. **Typography**: Use the 'Outfit' / 'Inter' hybrid with strong Arabic italic headings for a premium feel.
4. **No Placeholders as Labels**: Labels must always be present above the input for accessibility.
