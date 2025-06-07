import { Tabs } from 'antd'
export default function CustomTabs(props) {
    let { className = '', style = {}, tabs = [], fluid = true, tabBarProps = {}, renderTabBar, ...rest } = props
    if (fluid) className += ' h-p100 tabs-hfull '
    const newProps = { className, style, ...rest }
    const defaultActiveKey = (tabs.find(item => item.isDefault) || {}).key || 'USDT'
    const defaultRenderTabBar = (props, DefaultTabBar) => {
        // const { activeKey } = props
        return <DefaultTabBar {...props} {...tabBarProps} />
    }
    return (
        <Tabs animated={false} renderTabBar={renderTabBar || defaultRenderTabBar} defaultActiveKey={defaultActiveKey} {...newProps}>
            {
                tabs.map(tab => {
                    const { title, key, ...tabRest } = tab
                    return (
                        <Tabs.TabPane forceRender={true} tab={title} key={key} {...tabRest}>
                            {tab.content}
                        </Tabs.TabPane>
                    )
                })
            }
        </Tabs>
    )
}
