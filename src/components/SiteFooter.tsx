export default function SiteFooter() {
  return (
    <footer className="pt-4 pb-8 space-y-3">
      {/* CDN */}
      <div className="flex items-center justify-center gap-1.5 text-xs text-[#9ab5a0]">
        <span>本站 CDN 由</span>
        <img src="https://api.yaooa.cn/icons/foot-esa.png" alt="阿里云 ESA" title="阿里云 ESA" className="h-4 opacity-70 hover:opacity-100 transition-opacity" />
        <span>提供</span>
      </div>
      {/* 备案 */}
      <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2 text-xs text-[#9ab5a0]">
        <a
          href="https://beian.miit.gov.cn/"
          target="_blank" rel="noreferrer"
          className="inline-flex items-center gap-1.5 hover:text-[#3a6644] transition-colors"
        >
          <img src="https://api.yaooa.cn/icons/foot-icp.png" alt="ICP" className="h-3.5 opacity-70" />
          蜀ICP备2024102137号-3
        </a>
        <a
          href="https://www.beian.gov.cn/portal/registerSystemInfo?recordcode=51080202020150"
          target="_blank" rel="noreferrer"
          className="inline-flex items-center gap-1.5 hover:text-[#3a6644] transition-colors"
        >
          <img src="https://api.yaooa.cn/icons/foot-ga.png" alt="公安备案" className="h-3.5 opacity-70" />
          川公网安备51080202020150号
        </a>
      </div>
    </footer>
  );
}
