interface Props {
    pageType: string
}

const BottomNavigation = ({ pageType }: Partial<Props>) => {
    return (<>
        <div className="btm-nav text-lg font-medium text-white ">
            <a href="/" className={`${pageType !== 'category' ? 'bg-primaryBlue' : 'bg-lightBlue'}`}>
                <span className="btm-nav-label">Expenses</span>
            </a>
            <a href="/CategoriesPage" className={`${pageType === 'category' ? 'bg-primaryBlue' : 'bg-lightBlue'}`}>
                <span className="btm-nav-label">Category</span></a>

        </div></>);
}

export default BottomNavigation;