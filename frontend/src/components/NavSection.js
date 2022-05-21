import PropTypes from 'prop-types'
import { useRouter } from 'next/router'
import { List, ListSubheader } from '@material-ui/core'
import NavItem from './NavItem'

const renderNavItems = ({ depth = 0, items, pathname }) => (
    <List disablePadding>
        {items.reduce(
            // eslint-disable-next-line no-use-before-define
            (acc, item) =>
                reduceChildRoutes({
                    acc,
                    item,
                    pathname,
                    depth,
                }),
            []
        )}
    </List>
)

const reduceChildRoutes = ({ acc, pathname, item, depth }) => {
    const router = useRouter()
    const key = `${item.title}-${depth}`
    const exactMatch = item.path === router.asPath

    if (item.children) {
        const partialMatch = item.path === router.asPath
        // console.log(router.asPath)
        acc.push(
            <NavItem
                active={partialMatch}
                depth={depth}
                icon={item.icon}
                info={item.info}
                key={key}
                open={partialMatch}
                path={item.path}
                title={item.title}
            >
                {renderNavItems({
                    depth: depth + 1,
                    items: item.children,
                    pathname,
                })}
            </NavItem>
        )
    } else {
        acc.push(
            <NavItem
                active={exactMatch}
                depth={depth}
                icon={item.icon}
                info={item.info}
                key={key}
                path={item.path}
                title={item.title}
            />
        )
    }

    return acc
}

const NavSection = props => {
    const { items, pathname, title, ...other } = props

    return (
        <List
            subheader={
                <ListSubheader
                    disableGutters
                    disableSticky
                    sx={{
                        color: 'text.primary',
                        fontSize: '0.75rem',
                        lineHeight: 2.5,
                        fontWeight: 700,
                        textTransform: 'uppercase',
                    }}
                >
                    {title}
                </ListSubheader>
            }
            {...other}
        >
            {renderNavItems({
                items,
                pathname,
            })}
        </List>
    )
}

NavSection.propTypes = {
    items: PropTypes.array,
    pathname: PropTypes.string,
    title: PropTypes.string,
}

export default NavSection
