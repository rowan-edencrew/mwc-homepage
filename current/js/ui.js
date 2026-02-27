var Browser = {chk : navigator.userAgent.toLowerCase()}
Browser = {ie : Browser.chk.indexOf('msie') != -1, ie6 : Browser.chk.indexOf('msie 6') != -1, ie7 : Browser.chk.indexOf('msie 7') != -1, ie8 : Browser.chk.indexOf('msie 8') != -1, ie9 : Browser.chk.indexOf('msie 9') != -1, ie10 : Browser.chk.indexOf('msie 10') != -1, ie11 : Browser.chk.indexOf('msie 11') != -1, opera : !!window.opera, safari : Browser.chk.indexOf('safari') != -1, safari3 : Browser.chk.indexOf('applewebkir/5') != -1, mac : Browser.chk.indexOf('mac') != -1, chrome : Browser.chk.indexOf('chrome') != -1, firefox : Browser.chk.indexOf('firefox') != -1}
var responCheck = Browser.ie7 || Browser.ie8;

// mobile case :: scroll size
var mobile = (/iphone|ipod|ipad|android|blackberry|mini|windows\sce|palm/i.test(navigator.userAgent.toLowerCase()));
if (mobile) {
  $("html").addClass("mobile");
}


var module = {
    init : function(){
      module.togglebtnStart();
      module.navActive();
      module.guideEmailGate();
      module.contactFormValidation();
      module.playerQrGate();

      module.featuresAnimation();
      //module.featuresItemsScroll();
      module.howItWorksScroll();
      module.lottieInit();
      module.whyLucyScroll();
      module.lucyParallax();
      module.careersFocus();
      module.accordion.init();
      module.mobileMenuToggle();
    },
    togglebtnStart: function(){
      this.headerBtn = document.querySelector('header .btnStart');
      this.keyvi = document.querySelector('.keyvi');
      if (!this.headerBtn || !this.keyvi) return;
      const keyviBottom =
          this.keyvi.offsetTop + this.keyvi.offsetHeight + 450;
      const toggleButton = () => {
        const scrollTop = window.scrollY;
        if (scrollTop > keyviBottom) {
          this.headerBtn.classList.add('show');
        } else {
          this.headerBtn.classList.remove('show');
        }
      };
      toggleButton();
      window.addEventListener('scroll', toggleButton);
    },
    navActive: function () {
      const nav = document.querySelector('.nav');
      const contWrap = document.querySelector('.contWrap');
      if (!nav || !contWrap) return;

      const navLinks = Array.from(nav.querySelectorAll('a'));
      const sections = Array.from(contWrap.querySelectorAll('.section'));
      const contTop = contWrap.offsetTop;

      const getOffset = () => (window.innerWidth <= 820 ? 80 : 180);

      navLinks.forEach(link => {
        link.addEventListener('click', e => {
          e.preventDefault();
          const target = document.getElementById(link.dataset.target);
          if (!target) return;

          const offset = getOffset();

          window.scrollTo({
            top: contTop + target.offsetTop - offset + 500,
            behavior: 'smooth'
          });
        });
      });

      const updateActive = () => {
        const offset = getOffset();
        const scrollPos = window.scrollY - contTop + offset;
        let current = sections[0].id;

        sections.forEach(section => {
          if (scrollPos >= section.offsetTop) {
            current = section.id;
          }
        });

        navLinks.forEach(link => {
          const isActive = link.dataset.target === current;
          link.classList.toggle('active', isActive);

          if (isActive) {
            this.scrollNavToActive(link);
          }
        });
      };

      window.addEventListener('scroll', updateActive);
    },
    guideEmailGate: function () {
      const guideStage = document.querySelector('.guideStage');
      const guideWrap = document.querySelector('.guideWrap');
      const guide = document.querySelector('.guideWrap .guide');
      const downloadWrap = document.querySelector('.downloadWrap');
      if (!guideStage || !guideWrap || !guide || !downloadWrap) return;

      const emailInput = guide.querySelector('input[type="email"]');
      const submitBtn = guide.querySelector('button[type="button"]');
      const backBtn = downloadWrap.querySelector('.btnGuideBack');
      if (!emailInput || !submitBtn || !backBtn) return;
      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      let recoverTimer = null;
      const updateStageHeight = () => {
        const activeSection = guideStage.classList.contains('is-download') ? downloadWrap : guideWrap;
        const targetHeight = Math.max(activeSection.offsetHeight, activeSection.scrollHeight);
        guideStage.style.height = targetHeight + 'px';
      };

      const isEmailValid = () => {
        const value = emailInput.value.trim();
        return value.length > 0 && value.length <= 100 && emailPattern.test(value);
      };

      const replayBlueBarAnimation = () => {
        guide.classList.remove('is-recover');
        void guide.offsetWidth;
        guide.classList.add('is-recover');
        if (recoverTimer) {
          window.clearTimeout(recoverTimer);
        }
        recoverTimer = window.setTimeout(() => {
          guide.classList.remove('is-recover');
        }, 500);
      };

      const updateEmailState = () => {
        const hasValue = emailInput.value.trim().length > 0;
        const wasError = guide.classList.contains('is-error');
        const isValid = isEmailValid();
        const showError = hasValue && !isValid;
        emailInput.classList.toggle('is-invalid', showError);
        guide.classList.toggle('is-error', showError);
        if (wasError && !showError && hasValue && isValid && guide.matches(':focus-within')) {
          replayBlueBarAnimation();
        }
        submitBtn.disabled = !isValid;
        return isValid;
      };

      const showDownload = () => {
        emailInput.value = emailInput.value.trim();
        emailInput.dataset.touched = 'true';
        if (!updateEmailState()) {
          emailInput.focus();
          return;
        }
        guideStage.classList.add('is-download');
        window.requestAnimationFrame(updateStageHeight);
      };

      const resetGuideGate = () => {
        guideStage.classList.remove('is-download');
        emailInput.value = '';
        emailInput.dataset.touched = 'false';
        emailInput.classList.remove('is-valid', 'is-invalid');
        guide.classList.remove('is-error', 'is-recover');
        if (recoverTimer) {
          window.clearTimeout(recoverTimer);
          recoverTimer = null;
        }
        submitBtn.disabled = true;
        updateStageHeight();
      };

      resetGuideGate();

      submitBtn.addEventListener('click', showDownload);
      backBtn.addEventListener('click', () => {
        guideStage.classList.remove('is-download');
        window.requestAnimationFrame(updateStageHeight);
      });
      emailInput.addEventListener('input', () => {
        emailInput.dataset.touched = 'true';
        updateEmailState();
      });
      emailInput.addEventListener('blur', () => {
        emailInput.value = emailInput.value.trim();
        emailInput.dataset.touched = 'true';
        updateEmailState();
      });
      emailInput.addEventListener('keydown', (e) => {
        if (e.key !== 'Enter') return;
        e.preventDefault();
        showDownload();
      });
      window.addEventListener('pageshow', resetGuideGate);
      window.addEventListener('resize', updateStageHeight);
    },
    contactFormValidation: function () {
      const contactWrap = document.querySelector('.contactWrap');
      if (!contactWrap) return;

      const form = contactWrap.querySelector('form');
      const submitBtn = form ? form.querySelector('.btnContactSales') : null;
      const agreeInput = form ? form.querySelector('input[name="agree"]') : null;
      if (!form || !submitBtn || !agreeInput) return;

      const requiredFields = Array.from(
        form.querySelectorAll(
          'input[name="firstName"], input[name="lastName"], input[name="businessEmail"], input[name="company"], input[name="country"]'
        )
      );
      if (!requiredFields.length) return;
      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

      const isFieldValid = (field) => {
        const value = field.value.trim();
        if (!value || value.length > 100) return false;
        if (field.type === 'email') {
          return emailPattern.test(value);
        }
        return true;
      };

      const updateFieldState = (field, forceDisplay) => {
        const shouldDisplay =
          forceDisplay ||
          field.dataset.touched === 'true' ||
          field.value.trim().length > 0;
        const isValid = isFieldValid(field);
        field.classList.remove('is-valid', 'is-invalid');
        if (shouldDisplay) {
          field.classList.add(isValid ? 'is-valid' : 'is-invalid');
        }
        return isValid;
      };

      const updateSubmitState = () => {
        const allFieldsValid = requiredFields.every(isFieldValid);
        submitBtn.disabled = !(allFieldsValid && agreeInput.checked);
      };

      const openMailClient = () => {
        const subject = "[Lucy Studio] Contact Sales";
        const payload = {
          firstName: form.querySelector('input[name="firstName"]').value.trim(),
          lastName: form.querySelector('input[name="lastName"]').value.trim(),
          businessEmail: form.querySelector('input[name="businessEmail"]').value.trim(),
          company: form.querySelector('input[name="company"]').value.trim(),
          country: form.querySelector('input[name="country"]').value.trim()
        };
        const body = [
          "A new Contact Sales request was submitted.",
          "",
          "First name: " + payload.firstName,
          "Last name: " + payload.lastName,
          "Business email: " + payload.businessEmail,
          "Company: " + payload.company,
          "Country: " + payload.country
        ].join("\n");
        const mailto =
          "mailto:contact@edencrew.com?subject=" +
          encodeURIComponent(subject) +
          "&reply-to=" +
          encodeURIComponent(payload.businessEmail) +
          "&body=" +
          encodeURIComponent(body);
        window.location.href = mailto;
      };

      requiredFields.forEach((field) => {
        updateFieldState(field, false);
        field.addEventListener('input', () => {
          field.dataset.touched = 'true';
          updateFieldState(field, true);
          updateSubmitState();
        });
        field.addEventListener('blur', () => {
          field.value = field.value.trim();
          field.dataset.touched = 'true';
          updateFieldState(field, true);
          updateSubmitState();
        });
      });

      agreeInput.addEventListener('change', () => {
        updateSubmitState();
      });

      updateSubmitState();

      submitBtn.addEventListener('click', () => {
        requiredFields.forEach((field) => {
          field.value = field.value.trim();
          field.dataset.touched = 'true';
          updateFieldState(field, true);
        });
        updateSubmitState();
        const invalidField = requiredFields.find((field) => !isFieldValid(field));
        if (invalidField) {
          invalidField.focus();
          return;
        }
        if (!agreeInput.checked) return;
        openMailClient();
      });
    },
    playerQrGate: function () {
      const playerButtons = Array.from(document.querySelectorAll('.player .store-link-btn'));
      const modal = document.getElementById('playerQrModal');
      if (!playerButtons.length || !modal) return;

      const qrImage = modal.querySelector('.playerQrImage');
      const qrTitle = modal.querySelector('.playerQrTitle');
      const qrLink = modal.querySelector('.playerQrLink');
      const closeBtn = modal.querySelector('.playerQrClose');
      const dim = modal.querySelector('.playerQrDim');
      if (!qrImage || !qrTitle || !qrLink || !closeBtn || !dim) return;

      const isMobileClient = () => mobile || window.innerWidth <= 1024;
      const closeModal = () => {
        modal.hidden = true;
        qrImage.src = '';
      };
      const openModal = (label, url) => {
        qrTitle.textContent = 'Scan QR Code - ' + label;
        qrImage.src =
          'https://api.qrserver.com/v1/create-qr-code/?size=240x240&data=' +
          encodeURIComponent(url);
        qrLink.href = url;
        qrLink.textContent = 'Open ' + label;
        modal.hidden = false;
      };

      playerButtons.forEach((btn) => {
        btn.addEventListener('click', () => {
          const url = btn.dataset.storeUrl;
          const label = btn.dataset.storeName || 'Store';
          if (!url) return;
          if (isMobileClient()) {
            window.open(url);
            return;
          }
          openModal(label, url);
        });
      });

      closeBtn.addEventListener('click', closeModal);
      dim.addEventListener('click', closeModal);
      window.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && !modal.hidden) {
          closeModal();
        }
      });
    },
    scrollNavToActive: function (activeLink) {
      const scrollWrap = activeLink.parentElement;
      const targetScroll =
        activeLink.offsetLeft -
        (scrollWrap.offsetWidth / 2) +
        (activeLink.offsetWidth / 2);

      scrollWrap.scrollTo({
        left: targetScroll,
        behavior: 'smooth'
      });
    },
    featuresAnimation: function () {
      const wrap = document.querySelector('.featuresWrap');
      if (!wrap) return;
      const items = Array.from(wrap.querySelectorAll('li'));
      let startScale = 1.5;
      let endScale = 1;
      let startY = 0;
      let endY = 120;
      let columnCount = 3;
      let ticking = false;
      /* =========================
        열 개수 자동 계산
      ========================== */
      const getColumnCount = () => {
        if (!items.length) return 1;

        const firstTop = items[0].offsetTop;
        let count = 0;

        for (let i = 0; i < items.length; i++) {
          if (items[i].offsetTop === firstTop) count++;
        }
        return count || 1;
      };
      /* =========================
        스크롤
      ========================== */
      const onScroll = () => {
        if (ticking) return;
        requestAnimationFrame(() => {
          const vh = window.innerHeight;
          const rect = wrap.getBoundingClientRect();
          const start = vh;
          const end = -rect.height * 0.3;
          let wrapProgress = (start - rect.top) / (start - end);
          wrapProgress = Math.min(Math.max(wrapProgress, 0), 1);
          const scale = startScale - (startScale - endScale) * wrapProgress;
          const translateY = startY + (endY - startY) * wrapProgress;
          wrap.style.setProperty(
            '--features-transform',
            `scale(${scale}) translateY(${translateY}px)`
          );
          // 🔥 1열 → 기존 모바일 효과 유지
          if (columnCount === 1) {
            items.forEach((item, index) => {
              const itemRect = item.getBoundingClientRect();
              const trigger = vh * 0.9;
              let progress = (trigger - itemRect.top) / trigger;
              progress = Math.min(Math.max(progress, 0), 1);
              progress = 1 - Math.pow(1 - progress, 2.5);
              const x = index % 2 === 0 ? -90 : 90;
              const y = 40;
              item.style.opacity = progress;
              item.style.transform = `
                translate(${x * (1 - progress)}px, ${y * (1 - progress)}px)
                scale(${0.95 + 0.05 * progress})
              `;
            });
          }
          // 📐 2열 → 좌우 강하게 모임
          else if (columnCount === 2) {
            items.forEach((item, index) => {
              const itemRect = item.getBoundingClientRect();
              const trigger = vh * 0.9;
              let progress = (trigger - itemRect.top) / trigger;
              progress = Math.min(Math.max(progress, 0), 1);
              progress = 1 - Math.pow(1 - progress, 2.5);
              const isLeft = index % 2 === 0;
              const x = isLeft ? -220 : 220;
              const y = 80;
              item.style.opacity = progress;
              item.style.transform = `
                translate(${x * (1 - progress)}px, ${y * (1 - progress)}px)
                scale(${0.95 + 0.05 * progress})
              `;
            });
          }
          // 🖥 3열 이상 → row 웨이브
          else {
            const rowSize = columnCount;
            const rows = Math.ceil(items.length / rowSize);
            for (let r = 0; r < rows; r++) {
              const rowStart = r * 0.35;
              const rowEnd = rowStart + 0.35;
              let rowProgress = (wrapProgress - rowStart) / (rowEnd - rowStart);
              rowProgress = Math.min(Math.max(rowProgress, 0), 1);
              rowProgress = 1 - Math.pow(1 - rowProgress, 2.6);
              for (let i = 0; i < rowSize; i++) {
                const index = r * rowSize + i;
                if (!items[index]) continue;
                const centerOffset = (i - (rowSize - 1) / 2) * 260;
                const yOffset = i % 2 === 0 ? 160 : 120;
                items[index].style.opacity = rowProgress;
                items[index].style.transform = `
                  translate(${centerOffset * (1 - rowProgress)}px,
                            ${yOffset * (1 - rowProgress)}px)
                  scale(${0.94 + 0.06 * rowProgress})
                `;
              }
            }
          }
          ticking = false;
        });
        ticking = true;
      };
      const onResize = () => {
        columnCount = getColumnCount();
        onScroll();
      };
      window.addEventListener('scroll', onScroll);
      window.addEventListener('resize', onResize);
      columnCount = getColumnCount();
      onScroll();
    },
    howItWorksScroll: function () {
      const section = document.querySelector('.worksWrap');
      if (!section) return;
      const steps = section.querySelectorAll('.aside a');
      const contents = section.querySelectorAll('.howitlist > div');
      const aside = section.querySelector('.aside');
      const progressBar = aside?.querySelector('.progressBar');
      const wrap = document.getElementById('wrap');
      let isMobile = window.innerWidth <= 1024;
      const setValues = () => {
        isMobile = window.innerWidth <= 1024;
      };
      setValues();
      let ticking = false;
      const onScroll = () => {
        if (!ticking) {
          requestAnimationFrame(() => {
            const vh = window.innerHeight;
            const sectionRect = section.getBoundingClientRect();
            const totalScroll = section.offsetHeight - vh;

            // 1️⃣ progress 계산
            const scrolled = Math.min(Math.max(-sectionRect.top, 0), totalScroll);
            const progress = totalScroll > 0 ? scrolled / totalScroll : 0;

            // 2️⃣ currentIndex 계산
            let currentIndex = 0;
            const triggerLine = vh * 0.5;
            contents.forEach((content, i) => {
              const rect = content.getBoundingClientRect();
              if (rect.top <= triggerLine) currentIndex = i;
            });

            // 3️⃣ active 토글
            steps.forEach((el, i) => el.classList.toggle('active', i === currentIndex));
            contents.forEach((el, i) => el.classList.toggle('active', i === currentIndex));

            // 4️⃣ progressBar
            if (progressBar) {
              const asideHeight = aside.offsetHeight - 152;
              progressBar.style.height = asideHeight * progress + 'px';
            }
            // 5️⃣ 배경 변경
            const triggerPoint = isMobile ? vh * 0.3 : vh * 0.5;
            if (sectionRect.top <= triggerPoint && sectionRect.bottom > triggerPoint) {
              wrap?.classList.add('bgWhite');
            } else {
              wrap?.classList.remove('bgWhite');
            }
            ticking = false;
          });
          ticking = true;
        }
      };
      const onResize = () => {
        setValues();
        onScroll();
      };
      window.addEventListener('scroll', onScroll);
      window.addEventListener('resize', onResize);
      onScroll();
      // 7️⃣ aside 클릭 스크롤 이동
      steps.forEach((step, index) => {
        step.addEventListener('click', (e) => {
          e.preventDefault();
          const target = contents[index];
          if (!target) return;
          const headerOffset = isMobile
            ? aside.offsetHeight + parseFloat(getComputedStyle(aside).top)
            : 330;
          const top = window.scrollY + target.getBoundingClientRect().top - headerOffset;
          window.scrollTo({
            top: top,
            behavior: 'smooth',
          });
        });
      });
    },
    whyLucyScroll: function () {
      const items = document.querySelectorAll('.whylucyWrap li');
      if (!items.length) return;
      const triggerPoint = window.innerHeight * 1;
      const onScroll = () => {
        items.forEach(item => {
          const rect = item.getBoundingClientRect();
          if (rect.top < triggerPoint && rect.bottom > 0) {
            item.classList.add('active');
          } else {
            item.classList.remove('active');
          }
        });
      };
      window.addEventListener('scroll', onScroll);
      window.addEventListener('resize', onScroll);
      onScroll();
    },
    lottieInit: function () {
      const elements = document.querySelectorAll('[id^="why0"]');
      if (!elements.length) return;
      elements.forEach((el) => {
        const id = el.id;
        const jsonPath = 'images/' + id + '.json';
        const animation = bodymovin.loadAnimation({
          container: el,
          path: jsonPath,
          renderer: 'svg',
          loop: false,
          autoplay: false,   // ❗ 자동재생 끔          
        });
        animation.addEventListener('complete', function() {
          animation.goToAndPlay(0);
        });
        // 화면 진입 감지
        const observer = new IntersectionObserver((entries) => {
          entries.forEach(entry => {
            if (entry.isIntersecting) {
              animation.play();
            } else {
              animation.pause();
            }
          });
        }, {
          threshold: 0.4   // 화면 40% 보일 때 실행
        });
        observer.observe(el);
      });
    },
    lucyParallax: function () {
      const section = document.querySelector('.lucyWrap');
      if (!section) return;
      const img = section.querySelector('.img');
      const title = section.querySelector('h3');
      const button = section.querySelector('a');
      const onScroll = () => {
        const rect = section.getBoundingClientRect();
        const vh = window.innerHeight;
        if (rect.top < vh && rect.bottom > 0) {
          const progress = 1 - (rect.top / vh);          
          const isMobile = window.innerWidth <= 1200;
          if (!isMobile) {
            section.style.backgroundPosition = `${progress * 80}% ${50 - progress * 50}%`;
          }else{
            section.style.backgroundPosition = `${progress * 50}% ${50 - progress * 50}%`;
          }
          img.style.transform = `translateY(${progress * 100}px)`;
          title.style.transform = `translateY(${progress * -30}px)`;
          button.style.transform = `translateY(${progress * -20}px)`;
        }
      };
      window.addEventListener('scroll', onScroll);
      onScroll();
    },
    careersFocus: function () {
      const section = document.querySelector('.careersWrap');
      if (!section) return;
      const triggerLine = window.innerHeight * 0.5;
      const onScroll = () => {
        const rect = section.getBoundingClientRect();
        if (rect.top < triggerLine && rect.bottom > triggerLine) {
          section.classList.add('active');
        } else {
          section.classList.remove('active');
        }
      };
      window.addEventListener('scroll', onScroll);
      onScroll();
    },
    accordion: {
      init() {
        this.$acc = $('.accordion');
        this.bindEvents();
        if (this.$acc.hasClass('as-no')) return;
        this.$acc
          .not('.as-no')
          .find('li:first-child')
          .addClass('state-on')
          .find('.toggle-ele')
          .show();
      },
      bindEvents() {
        this.$acc.on('click', 'li > em', (e) => {
          e.preventDefault();
          this.toggle($(e.currentTarget));
        });
      },
      toggle($target) {
        const $item = $target.parent('li');
        const $parentAcc = $item.closest('.accordion');
        const $content = $item.find('.toggle-ele');
        if ($item.hasClass('state-on')) {
          $content.stop(true, true).slideUp(200, () => {
            $item.removeClass('state-on');
          });
          return;
        }
        if ($parentAcc.hasClass('sync')) {
          $parentAcc.find('li').removeClass('state-on');
          $parentAcc.find('.toggle-ele').stop(true, true).slideUp(200);
        }
        $item.addClass('state-on');
        $content.stop(true, true).slideDown(200);
      }
    },
    layerOpen:function(e, ele){
      var name_id = $('#'+ele),
          refFocusEl = e,
          $htmlH = $("html").scrollTop();
      name_id.attr('tabindex', '0').fadeIn().focus();
      name_id.append('<a href="#" class="loop">포커스이동</a>');
      $('.loop').focus(function(){
        name_id.attr('tabindex', '0').fadeIn().focus();
      });
      //$('html,body').css({'overflow':'hidden'});
      $(window).resize(function(){
        var win_h = $(window).outerHeight();
        var win_w = $(window).outerWidth();
        var pop_h = name_id.find('.pop-layer').outerHeight();
        var pop_w = name_id.find('.pop-layer').outerWidth();
        var position_top =  (win_h - pop_h) / 2;
        var position_left = (win_w - pop_w) / 2;
        if(position_top <= 0){position_top = 0;}
        if(position_left <= 0){position_left = 0;}
        name_id.find('.pop-layer').css({'top':position_top,'left':position_left});
        pop_h >= win_h ? $('.dimmed').css('height',pop_h) : $('.dimmed').css('height', 100 + "%");
        pop_w >= win_w ? $('.dimmed').css('width',pop_w) : $('.dimmed').css('width', 100 + "%");
      }).resize();
      //close
      name_id.find('.btn-close, .dimmed').click(function(e){
        e.preventDefault();
        e.stopPropagation();
        refFocusEl.focus();
        $('.loop').remove();
        $('.wrap-layer-popup').fadeOut();
        //$('html,body').attr('style','');
        $("html").scrollTop($htmlH)
      });
    },
    mobileMenuToggle: function(){
      const btn = document.querySelector('.btnMenu');
      const menu = document.querySelector('.mobileMenu');
      if(!btn || !menu) return;
      const BREAKPOINT = 750;
      let scrollY = 0;
      btn.addEventListener('click', () => {
        const active = btn.classList.toggle('active');
        menu.classList.toggle('active');
        if (active) {
          scrollY = window.scrollY;
          document.body.style.cssText =
            `position:fixed;top:-${scrollY}px;width:100%;`;
        } else {
          document.body.style.cssText = '';
          window.scrollTo(0, scrollY);
        }
      });
      window.addEventListener('resize', () => {
        if (window.innerWidth > BREAKPOINT && btn.classList.contains('active')) {
          btn.classList.remove('active');
          menu.classList.remove('active');
          document.body.style.cssText = '';
          window.scrollTo(0, scrollY);
        }
      });
    },
};

$(function(){
  module.init();
});
