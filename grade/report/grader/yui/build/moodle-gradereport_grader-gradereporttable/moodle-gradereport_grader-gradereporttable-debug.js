YUI.add('moodle-gradereport_grader-gradereporttable', function (Y, NAME) {

// This file is part of Moodle - http://moodle.org/
//
// Moodle is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.
//
// Moodle is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU General Public License for more details.
//
// You should have received a copy of the GNU General Public License
// along with Moodle.  If not, see <http://www.gnu.org/licenses/>.

/**
 * Grader Report Functionality.
 *
 * @module    moodle-gradereport_grader-gradereporttable
 * @package   gradereport_grader
 * @copyright 2014 UC Regents
 * @license   http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 * @author    Alfonso Roman <aroman@oid.ucla.edu>
 */

/**
 * @module moodle-gradereport_grader-gradereporttable
 */

var SELECTORS = {
        FOOTERROW: '#user-grades .avg',
        GRADECELL: 'td.grade',
        GRADERTABLE: '.gradeparent table',
        GRADEPARENT: '.gradeparent',
        HEADERCELL: '.gradebook-header-cell',
        HEADERROW: '#user-grades tr.heading',
        STUDENTHEADER: '#studentheader',
        USERCELL: '#user-grades .user.cell'
    },
    CSS = {
        OVERRIDDEN: 'overridden',
        TOOLTIPACTIVE: 'tooltipactive'
    };

/**
 * The Grader Report Table.
 *
 * @namespace M.gradereport_grader
 * @class ReportTable
 * @constructor
 */
function ReportTable() {
    ReportTable.superclass.constructor.apply(this, arguments);
}

Y.extend(ReportTable, Y.Base, {
    /**
     * Array of EventHandles.
     *
     * @type EventHandle[]
     * @property _eventHandles
     * @protected
     */
    _eventHandles: [],

    /**
     * A Node reference to the grader table.
     *
     * @property graderTable
     * @type Node
     */
    graderTable: null,

    /**
     * Setup the grader report table.
     *
     * @method initializer
     */
    initializer: function() {
        // Some useful references within our target area.
        this.graderRegion = Y.one(SELECTORS.GRADEPARENT);
        this.graderTable = Y.one(SELECTORS.GRADERTABLE);

        // Setup the floating headers.
        this.setupFloatingHeaders();

        // Setup the mouse tooltips.
        this.setupTooltips();
    },

    /**
     * Get the text content of the username for the specified grade item.
     *
     * @method getGradeUserName
     * @param {Node} cell The grade item cell to obtain the username for
     * @return {String} The string content of the username cell.
     */
    getGradeUserName: function(cell) {
        var userrow = cell.ancestor('tr'),
            usercell = userrow.one("th.user .username");

        if (usercell) {
            return usercell.get('text');
        } else {
            return '';
        }
    },

    /**
     * Get the text content of the item name for the specified grade item.
     *
     * @method getGradeItemName
     * @param {Node} cell The grade item cell to obtain the item name for
     * @return {String} The string content of the item name cell.
     */
    getGradeItemName: function(cell) {
        var itemcell = Y.one("th.item[data-itemid='" + cell.getData('itemid') + "']");
        if (itemcell) {
            return itemcell.get('text');
        } else {
            return '';
        }
    },

    /**
     * Get the text content of any feedback associated with the grade item.
     *
     * @method getGradeFeedback
     * @param {Node} cell The grade item cell to obtain the item name for
     * @return {String} The string content of the feedback.
     */
    getGradeFeedback: function(cell) {
        return cell.getData('feedback');
    }
});

Y.namespace('M.gradereport_grader').ReportTable = ReportTable;
Y.namespace('M.gradereport_grader').init = function(config) {
    return new Y.M.gradereport_grader.ReportTable(config);
};
// This file is part of Moodle - http://moodle.org/
//
// Moodle is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.
//
// Moodle is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU General Public License for more details.
//
// You should have received a copy of the GNU General Public License
// along with Moodle.  If not, see <http://www.gnu.org/licenses/>.

/**
 * @module moodle-gradereport_grader-gradereporttable
 * @submodule highlighter
 */

/**
 * Provides row, and column highlighting functionality to the grader report.
 *
 * See {{#crossLink "M.gradereport_grader.ReportTable"}}{{/crossLink}} for details.
 *
 * @namespace M.gradereport_grader
 * @class Highlighter
 */

var COLMARK = 'vmarked',
    UIDMARK = 'hmarked';

function Highlighter() {}

Highlighter.ATTRS= {
};

var ROWFIELDS = 'th.user, th.userreport, th.userfield, .gradebook-user-cell',
    COLFIELDS = 'tr[data-itemid] th.item, .gradebook-header-cell';

Highlighter.prototype = {
    /**
     * Setup column and row highlighting.
     *
     * @method setupHighlighter
     * @chainable
     */
    setupHighlighter: function() {
        this._eventHandles.push(
            // Clicking on the cell should highlight the row.
            this.graderRegion.delegate('click', this._highlightUser, ROWFIELDS, this),

            // Clicking on the cell should highlight the current column.
            this.graderRegion.delegate('click', this._highlightColumn, COLFIELDS, this)
        );

        return this;
    },

    /**
     * Highlight the current assignment column.
     *
     * @method _highlightColumn
     * @param {EventFacade} e The Event fired. This describes the column to highlight.
     * @protected
     */
    _highlightColumn: function(e) {
        var itemid = e.target.getData('itemid');

        if (typeof itemid === 'undefined') {
            // Unable to determine which user to highlight. Return early.
            return;
        }

        this.graderRegion.all('td.cell[data-itemid="' + itemid + '"]').toggleClass(COLMARK);
    },

    /**
     * Highlight the current user row.
     *
     * @method _highlightUser
     * @param {EventFacade} e The Event fired. This describes the user to highlight.
     * @protected
     */
    _highlightUser: function(e) {
        var clickedRow = e.target.ancestor('[data-uid]', true),
            tableRow,
            uid;

        if (clickedRow) {
            uid = clickedRow.getData('uid');
        }

        if (typeof uid === 'undefined') {
            // Unable to determine which user to highlight. Return early.
            return;
        }

        tableRow = this.graderRegion.one('tr[data-uid="' + uid + '"]');
        if (tableRow) {
            tableRow.toggleClass(UIDMARK);
        }
    }
};

Y.Base.mix(Y.M.gradereport_grader.ReportTable, [Highlighter]);
// This file is part of Moodle - http://moodle.org/
//
// Moodle is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.
//
// Moodle is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU General Public License for more details.
//
// You should have received a copy of the GNU General Public License
// along with Moodle.  If not, see <http://www.gnu.org/licenses/>.

/**
 * @module moodle-gradereport_grader-gradereporttable
 * @submodule floatingheaders
 */

/**
 * Provides floating headers to the grader report.
 *
 * See {{#crossLink "M.gradereport_grader.ReportTable"}}{{/crossLink}} for details.
 *
 * @namespace M.gradereport_grader
 * @class FloatingHeaders
 */

var HEIGHT = 'height',
    WIDTH = 'width',
    OFFSETWIDTH = 'offsetWidth',
    OFFSETHEIGHT = 'offsetHeight';

function FloatingHeaders() {}

FloatingHeaders.ATTRS= {
};

FloatingHeaders.prototype = {
    /**
     * The height of the page header if a fixed position, floating header
     * was found.
     *
     * @property pageHeaderHeight
     * @type Number
     * @default 0
     * @protected
     */
    pageHeaderHeight: 0,

    /**
     * A Node representing the container div.
     *
     * Positioning will be based on this element, which must have
     * the CSS rule 'position: relative'.
     *
     * @property container
     * @type Node
     * @protected
     */
    container: null,

    /**
     * A Node representing the header cell.
     *
     * @property headerCell
     * @type Node
     * @protected
     */
    headerCell: null,

    /**
     * A Node representing the header row.
     *
     * @property headerRow
     * @type Node
     * @protected
     */
    headerRow: null,

    /**
     * A Node representing the first cell which contains user name information.
     *
     * @property firstUserCell
     * @type Node
     * @protected
     */
    firstUserCell: null,

    /**
     * A Node representing the original table footer row.
     *
     * @property tableFooterRow
     * @type Node
     * @protected
     */
    tableFooterRow: null,

    /**
     * A Node representing the floating footer row in the grading table.
     *
     * @property footerRow
     * @type Node
     * @protected
     */
    footerRow: null,

    /**
     * A Node representing the floating assignment header.
     *
     * @property assignmentHeadingContainer
     * @type Node
     * @protected
     */
    assignmentHeadingContainer: null,

    /**
     * A Node representing the floating user header. This is the header with the Surname/First name
     * sorting.
     *
     * @property userColumnHeader
     * @type Node
     * @protected
     */
    userColumnHeader: null,

    /**
     * A Node representing the floating user column. This is the column containing all of the user
     * names.
     *
     * @property userColumn
     * @type Node
     * @protected
     */
    userColumn: null,

    /**
     * The position of the bottom of the first user cell.
     * This is used when processing the scroll event as an optimisation. It must be updated when
     * additional rows are loaded, or the window changes in some fashion.
     *
     * @property firstUserCellBottom
     * @type Node
     * @protected
     */
    firstUserCellBottom: 0,

    /**
     * The position of the left of the first user cell.
     * This is used when processing the scroll event as an optimisation. It must be updated when
     * additional rows are loaded, or the window changes in some fashion.
     *
     * @property firstUserCellLeft
     * @type Node
     * @protected
     */
    firstUserCellLeft: 0,

    /**
     * The position of the top of the final user cell.
     * This is used when processing the scroll event as an optimisation. It must be updated when
     * additional rows are loaded, or the window changes in some fashion.
     *
     * @property lastUserCellTop
     * @type Node
     * @protected
     */
    lastUserCellTop: 0,

    /**
     * Array of EventHandles.
     *
     * @type EventHandle[]
     * @property _eventHandles
     * @protected
     */
    _eventHandles: [],

    /**
     * Setup the grader report table.
     *
     * @method setupFloatingHeaders
     * @chainable
     */
    setupFloatingHeaders: function() {
        // Grab references to commonly used Nodes.
        this.firstUserCell = Y.one(SELECTORS.USERCELL);
        this.container = Y.one(SELECTORS.GRADEPARENT);

        if (!this.firstUserCell) {
            // No need for floating elements, there are no users.
            return this;
        }

        // Generate floating elements.
        this._setupFloatingUserColumn();
        this._setupFloatingUserHeader();
        this._setupFloatingAssignmentHeaders();
        this._setupFloatingAssignmentFooter();

        // Calculate the positions of edge cells. These are used for positioning of the floating headers.
        // This must be called after the floating headers are setup, but before the scroll event handler is invoked.
        this._calculateCellPositions();

        // Setup the floating element initial positions by simulating scroll.
        this._handleScrollEvent();

        // Setup the event handlers.
        this._setupEventHandlers();

        return this;
    },

    /**
     * Calculate the positions of some cells. These values are used heavily
     * in scroll event handling.
     *
     * @method _calculateCellPositions
     * @protected
     */
    _calculateCellPositions: function() {
        // The header row shows the assigment headers and is floated to the top of the window.
        this.headerRowTop = this.headerRow.getY();

        // The footer row shows the grade averages and will be floated to the page bottom.
        if (this.tableFooterRow) {
            this.footerRowPosition = this.tableFooterRow.getY();
        }

        var userCellList = Y.all(SELECTORS.USERCELL);

        // The left of the user cells matches the left of the headerRow.
        this.firstUserCellLeft = this.headerRow.getX();

        if (userCellList.size() > 1) {
            // Use the top of the second cell for the bottom of the first cell.
            // This is used when scrolling to fix the footer to the top edge of the window.
            var firstUserCell = userCellList.item(1);
            this.firstUserCellBottom = firstUserCell.getY() + parseInt(firstUserCell.getComputedStyle(HEIGHT), 10);

            // Use the top of the penultimate cell when scrolling the header.
            // The header is the same size as the cells.
            this.lastUserCellTop = userCellList.item(userCellList.size() - 2).getY();
        } else {
            var firstItem = userCellList.item(0);
            // We can't use the top of the second row as there is only one row.
            this.lastUserCellTop = firstItem.getY();

            if (this.tableFooterRow) {
                // The footer is present so we can use that.
                this.firstUserCellBottom = this.footerRowPosition + parseInt(this.tableFooterRow.getComputedStyle(HEIGHT), 10);
            } else {
                // No other clues - calculate the top instead.
                this.firstUserCellBottom = firstItem.getY() + firstItem.get('offsetHeight');
            }
        }

        // Check whether a header is present and whether it is floating.
        var header = Y.one('header');
        this.pageHeaderHeight = 0;
        if (header) {
            if (header.getComputedStyle('position') === 'fixed') {
                this.pageHeaderHeight = header.get(OFFSETHEIGHT);
            }
        }
    },

    /**
     * Get the relative XY of the node.
     *
     * @method _getRelativeXY
     * @protected
     * @param {Node} node The node to get the position of.
     * @return {Array} Containing X and Y.
     */
    _getRelativeXY: function(node) {
        return this._getRelativeXYFromXY(node.getX(), node.getY());
    },

    /**
     * Get the relative positioning from coordinates.
     *
     * This gives the position according to the parent of the table, which must
     * be set as position: relative.
     *
     * @method _getRelativeXYFromXY
     * @protected
     * @param {Number} x X position.
     * @param {Number} y Y position.
     * @return {Array} Containing X and Y.
     */
    _getRelativeXYFromXY: function(x, y) {
        var parentXY = this.container.getXY();
        return [Math.floor(x - parentXY[0]), Math.floor(y - parentXY[1])];
    },

    /**
     * Get the relative positioning of an elements from coordinates.
     *
     * @method _getRelativeXFromX
     * @protected
     * @param {Number} pos X position.
     * @return {Number} relative X position.
     */
    _getRelativeXFromX: function(pos) {
        return this._getRelativeXYFromXY(pos, 0)[0];
    },

    /**
     * Get the relative positioning of an elements from coordinates.
     *
     * @method _getRelativeYFromY
     * @protected
     * @param {Number} pos Y position.
     * @return {Number} relative Y position.
     */
    _getRelativeYFromY: function(pos) {
        return this._getRelativeXYFromXY(0, pos)[1];
    },

    /**
     * Return the size of the horizontal scrollbar.
     *
     * @method _getScrollBarHeight
     * @protected
     * @return {Number} Height of the scrollbar.
     */
    _getScrollBarHeight: function() {
        if (Y.UA.ie && Y.UA.ie >= 10) {
            // IE has transparent scrollbars, which sometimes disappear... it's better to ignore them.
            return 0;
        } else if (Y.config.doc.body.scrollWidth > Y.config.doc.body.clientWidth) {
            // The document can be horizontally scrolled.
            return Y.DOM.getScrollbarWidth();
        }
        return 0;
    },

    /**
     * Setup the main event listeners.
     * These deal with things like window events.
     *
     * @method _setupEventHandlers
     * @protected
     */
    _setupEventHandlers: function() {
        this._eventHandles.push(
            // Listen for window scrolls, resizes, and rotation events.
            Y.one(Y.config.win).on('scroll', this._handleScrollEvent, this),
            Y.one(Y.config.win).on('resize', this._handleResizeEvent, this),
            Y.one(Y.config.win).on('orientationchange', this._handleResizeEvent, this)
        );
    },

    /**
     * Create and setup the floating column of user names.
     *
     * @method _setupFloatingUserColumn
     * @protected
     */
    _setupFloatingUserColumn: function() {
        // Grab all cells in the user names column.
        var userColumn = Y.all(SELECTORS.USERCELL),

        // Create a floating table.
            floatingUserColumn = Y.Node.create('<div aria-hidden="true" role="presentation" id="gradebook-user-container"></div>'),

        // Get the XY for the floating element.
            coordinates = this._getRelativeXY(this.firstUserCell);

        // Generate the new fields.
        userColumn.each(function(node) {
            // Create and configure the new container.
            var containerNode = Y.Node.create('<div aria-hidden="true" class="gradebook-user-cell"></div>'),
                height,
                width;

            // IE madness...
            if (Y.UA.ie) {
                var bb = parseInt(node.getComputedStyle('borderBottomWidth'), 10),
                    bt = parseInt(node.getComputedStyle('borderTopWidth'), 10),
                    bl = parseInt(node.getComputedStyle('borderLeftWidth'), 10),
                    br = parseInt(node.getComputedStyle('borderRightWidth'), 10),
                    pb = parseInt(node.getComputedStyle('paddingBottom'), 10),
                    pt = parseInt(node.getComputedStyle('paddingTop'), 10),
                    pl = parseInt(node.getComputedStyle('paddingLeft'), 10),
                    pr = parseInt(node.getComputedStyle('paddingRight'), 10);
                height = node.get(OFFSETHEIGHT) - bb - bt - pb - pt;
                width = node.get(OFFSETWIDTH) - bl - br - pl - pr;
            } else {
                height = node.getComputedStyle(HEIGHT);
                width = node.getComputedStyle(WIDTH);
            }

            containerNode.set('innerHTML', node.get('innerHTML'))
                    .setAttribute('data-uid', node.ancestor('tr').getData('uid'))
                    .setStyles({
                        height: height,
                        width:  width
                    });

            // Add the new nodes to our floating table.
            floatingUserColumn.appendChild(containerNode);
        }, this);

        // Style the floating user container.
        floatingUserColumn.setStyles({
            left:       coordinates[0] + 'px',
            position:   'absolute',
            top:        coordinates[1] + 'px'
        });

        // Append to the grader region.
        this.graderRegion.append(floatingUserColumn);

        // Store a reference to this for later - we use it in the event handlers.
        this.userColumn = floatingUserColumn;
    },

    /**
     * Create and setup the floating username header cell.
     *
     * @method _setupFloatingUserHeader
     * @protected
     */
    _setupFloatingUserHeader: function() {
        // We make various references to the this header cell. Store it for later.
        this.headerRow = Y.one(SELECTORS.HEADERROW);
        this.headerCell = Y.one(SELECTORS.STUDENTHEADER);

        // Float the 'user name' header cell.
        var floatingUserCell = Y.Node.create('<div aria-hidden="true" role="presentation" id="gradebook-user-header-container"></div>'),
            firstUserXY = this._getRelativeXY(this.firstUserCell),
            headerXY = this._getRelativeXY(this.headerRow);

        // Append node contents
        floatingUserCell.set('innerHTML', this.headerCell.getHTML());
        floatingUserCell.setStyles({
            height:     this.headerCell.getComputedStyle(HEIGHT),
            left:       firstUserXY[0] + 'px',
            position:   'absolute',
            top:        headerXY[1] + 'px',
            width:      this.firstUserCell.getComputedStyle(WIDTH)
        });

        // Append to the grader region.
        this.graderRegion.append(floatingUserCell);

        // Store a reference to this for later - we use it in the event handlers.
        this.userColumnHeader = floatingUserCell;
    },

    /**
     * Create and setup the floating assignment header row.
     *
     * @method _setupFloatingAssignmentHeaders
     * @protected
     */
    _setupFloatingAssignmentHeaders: function() {
        this.headerRow = Y.one('#user-grades tr.heading');

        var gradeHeaders = Y.all('#user-grades tr.heading .cell');

        // Generate a floating headers
        var floatingGradeHeaders = Y.Node.create('<div aria-hidden="true" role="presentation" id="gradebook-header-container"></div>');

        var coordinates = this._getRelativeXY(this.headerRow);

        var floatingGradeHeadersWidth = 0;
        var floatingGradeHeadersHeight = 0;
        var gradeHeadersOffset = coordinates[0];

        gradeHeaders.each(function(node) {
            var nodepos = this._getRelativeXY(node)[0];

            var newnode = Y.Node.create('<div class="gradebook-header-cell"></div>');
            newnode.append(node.getHTML())
                    .addClass(node.getAttribute('class'))
                    .setData('itemid', node.getData('itemid'))
                    .setStyles({
                        height:     node.getComputedStyle(HEIGHT),
                        left:       (nodepos - gradeHeadersOffset) + 'px',
                        position:   'absolute',
                        width:      node.getComputedStyle(WIDTH)
                    });

            // Sum up total widths - these are used in the container styles.
            // Use the offsetHeight and Width here as this contains the
            // padding, margin, and borders.
            floatingGradeHeadersWidth += parseInt(node.get(OFFSETWIDTH), 10);
            floatingGradeHeadersHeight = node.get(OFFSETHEIGHT);

            // Append to our floating table.
            floatingGradeHeaders.appendChild(newnode);
        }, this);

        // Position header table.
        floatingGradeHeaders.setStyles({
            height:     floatingGradeHeadersHeight + 'px',
            left:       coordinates[0] + 'px',
            position:   'absolute',
            top:        coordinates[1] + 'px',
            width:      floatingGradeHeadersWidth + 'px'
        });

        // Insert in place before the grader headers.
        this.userColumnHeader.insert(floatingGradeHeaders, 'before');

        // Store a reference to this for later - we use it in the event handlers.
        this.assignmentHeadingContainer = floatingGradeHeaders;
    },

    /**
     * Create and setup the floating header row of assignment titles.
     *
     * @method _setupFloatingAssignmentFooter
     * @protected
     */
    _setupFloatingAssignmentFooter: function() {
        this.tableFooterRow = Y.one('#user-grades .avg');
        if (!this.tableFooterRow) {
            Y.log('Averages footer not found - unable to float it.', 'warn', LOGNS);
            return;
        }

        // Generate the sticky footer row.
        var footerCells = this.tableFooterRow.all('.cell');

        // Create a container.
        var floatingGraderFooter = Y.Node.create('<div aria-hidden="true" role="presentation" id="gradebook-footer-container"></div>');
        var footerWidth = 0;
        var coordinates = this._getRelativeXY(this.tableFooterRow);
        var footerRowOffset = coordinates[0];

        // Copy cell content.
        footerCells.each(function(node) {
            var newnode = Y.Node.create('<div class="gradebook-footer-cell"></div>');
            var nodepos = this._getRelativeXY(node)[0];
            newnode.set('innerHTML', node.getHTML());
            newnode.setStyles({
                height:     this._getHeight(node),
                left:       (nodepos - footerRowOffset) + 'px',
                position:   'absolute',
                width:      this._getWidth(node)
            });

            floatingGraderFooter.append(newnode);
            footerWidth += parseInt(node.get(OFFSETWIDTH), 10);
        }, this);

        // Attach 'Update' button.
        var updateButton = Y.one('#gradersubmit');
        if (updateButton) {
            // TODO decide what to do with classes here to make them compatible with the base themes.
            var button = Y.Node.create('<button class="btn btn-sm btn-default">' + updateButton.getAttribute('value') + '</button>');
            button.on('click', function() {
                    updateButton.simulate('click');
            });
            floatingGraderFooter.one('.gradebook-footer-cell').append(button);
        }

        // Position the row
        floatingGraderFooter.setStyles({
            position:   'absolute',
            left:       coordinates[0] + 'px',
            bottom:     0,
            height:     this._getHeight(this.tableFooterRow),
            width:      footerWidth + 'px',
        });

        // Append to the grader region.
        this.graderRegion.append(floatingGraderFooter);

        this.footerRow = floatingGraderFooter;
    },

    /**
     * Process a Scroll Event on the window.
     *
     * @method _handleScrollEvent
     * @protected
     */
    _handleScrollEvent: function() {
        // Performance is important in this function as it is called frequently and in quick succesion.
        // To prevent layout thrashing when the DOM is repeatedly updated and queried, updated and queried,
        // updates must be batched.

        // Next do all the calculations.
        var assignmentHeadingContainerStyles = {},
            userColumnHeaderStyles = {},
            userColumnStyles = {},
            footerStyles = {},
            coord = 0;

        // Header position.
        assignmentHeadingContainerStyles.left = this._getRelativeXFromX(this.headerRow.getX());
        if (Y.config.win.pageYOffset + this.pageHeaderHeight > this.headerRowTop) {
            if (Y.config.win.pageYOffset + this.pageHeaderHeight < this.lastUserCellTop) {
                coord = this._getRelativeYFromY(Y.config.win.pageYOffset + this.pageHeaderHeight);
                assignmentHeadingContainerStyles.top = coord + 'px';
                userColumnHeaderStyles.top = coord + 'px';
            } else {
                coord = this._getRelativeYFromY(this.lastUserCellTop);
                assignmentHeadingContainerStyles.top = coord + 'px';
                userColumnHeaderStyles.top = coord + 'px';
            }
        } else {
            coord = this._getRelativeYFromY(this.headerRowTop);
            assignmentHeadingContainerStyles.top = coord + 'px';
            userColumnHeaderStyles.top = coord + 'px';
        }

        // User column position.
        if (Y.config.win.pageXOffset > this.firstUserCellLeft) {
            coord = this._getRelativeXFromX(Y.config.win.pageXOffset);
            userColumnStyles.left = coord + 'px';
            userColumnHeaderStyles.left = coord + 'px';
        } else {
            coord = this._getRelativeXFromX(this.firstUserCellLeft);
            userColumnStyles.left = coord + 'px';
            userColumnHeaderStyles.left = coord + 'px';
        }

        // Update footer.
        if (this.footerRow) {
            footerStyles.left = this._getRelativeXFromX(this.headerRow.getX());

            // Determine whether the footer should now be shown as sticky.
            var pageHeight = Y.config.win.innerHeight,
                pageOffset = Y.config.win.pageYOffset,
                bottomScrollPosition = pageHeight - this._getScrollBarHeight() + pageOffset,
                footerRowHeight = parseInt(this.footerRow.getComputedStyle(HEIGHT), 10),
                footerBottomPosition = footerRowHeight + this.footerRowPosition;

            if (bottomScrollPosition < footerBottomPosition && bottomScrollPosition > this.firstUserCellBottom) {
                // We have not scrolled below the footer, nor above the first row.
                footerStyles.bottom = Math.ceil(footerBottomPosition - bottomScrollPosition) + 'px';
            } else {
                // The footer should not float any more.
                footerStyles.bottom = 0;
            }
        }

        // Finally, apply the styles.
        this.assignmentHeadingContainer.setStyles(assignmentHeadingContainerStyles);
        this.userColumnHeader.setStyles(userColumnHeaderStyles);
        this.userColumn.setStyles(userColumnStyles);
        this.footerRow.setStyles(footerStyles);
    },

    /**
     * Process a size change Event on the window.
     *
     * @method _handleResizeEvent
     * @protected
     */
    _handleResizeEvent: function() {
        // Recalculate the position of the edge cells for scroll positioning.
        this._calculateCellPositions();

        // Simulate a scroll.
        this._handleScrollEvent();

        // Resize user cells.
        var userWidth = this.firstUserCell.getComputedStyle(WIDTH);
        var userCells = Y.all(SELECTORS.USERCELL);
        this.userColumnHeader.setStyle('width', userWidth);
        this.userColumn.all('.gradebook-user-cell').each(function(cell, idx) {
            cell.setStyles({
                width: userWidth,
                height: userCells.item(idx).getComputedStyle(HEIGHT)
            });
        }, this);

        // Resize headers & footers.
        // This is an expensive operation, not expected to happen often.
        var headers = this.assignmentHeadingContainer.all(SELECTORS.HEADERCELL);
        var resizedcells = Y.all('#user-grades .heading .cell');

        var headeroffsetleft = this.headerRow.getX();
        var newcontainerwidth = 0;
        resizedcells.each(function(cell, idx) {
            var headercell = headers.item(idx);

            newcontainerwidth += cell.get(OFFSETWIDTH);
            var styles = {
                width: cell.getComputedStyle(WIDTH),
                left: cell.getX() - headeroffsetleft + 'px'
            };
            headercell.setStyles(styles);
        });

        var footers = Y.all('#gradebook-footer-container .gradebook-footer-cell');
        if (footers.size() !== 0) {
            var resizedavgcells = Y.all('#user-grades .avg .cell');

            resizedavgcells.each(function(cell, idx) {
                var footercell = footers.item(idx);
                var styles = {
                    width: cell.getComputedStyle(WIDTH),
                    left: cell.getX() - headeroffsetleft + 'px'
                };
                footercell.setStyles(styles);
            });
        }

        this.assignmentHeadingContainer.setStyle('width', newcontainerwidth);
    },

    /**
     * Determine the height of the specified Node.
     *
     * With IE, the height used when setting a height is the offsetHeight.
     * All other browsers set this as this inner height.
     *
     * @method _getHeight
     * @protected
     * @param {Node} node
     * @return String
     */
    _getHeight: function(node) {
        if (Y.UA.ie) {
            return node.get(OFFSETHEIGHT) + 'px';
        } else {
            return node.getComputedStyle(HEIGHT);
        }
    },

    /**
     * Determine the width of the specified Node.
     *
     * With IE, the width used when setting a width is the offsetWidth.
     * All other browsers set this as this inner width.
     *
     * @method _getWidth
     * @protected
     * @param {Node} node
     * @return String
     */
    _getWidth: function(node) {
        if (Y.UA.ie) {
            return node.get(OFFSETWIDTH) + 'px';
        } else {
            return node.getComputedStyle(WIDTH);
        }
    }
};

Y.Base.mix(Y.M.gradereport_grader.ReportTable, [FloatingHeaders]);
// This file is part of Moodle - http://moodle.org/
//
// Moodle is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.
//
// Moodle is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU General Public License for more details.
//
// You should have received a copy of the GNU General Public License
// along with Moodle.  If not, see <http://www.gnu.org/licenses/>.

/**
 * @module moodle-gradereport_grader-gradereporttable
 * @submodule tooltip
 */

/**
 * Provides tooltip functionality on the grader report.
 *
 * See {{#crossLink "M.gradereport_grader.ReportTable"}}{{/crossLink}} for details.
 *
 * @namespace M.gradereport_grader
 * @class Tooltip
 */

function Tooltip() {}

Tooltip.ATTRS= {
};

var CONTENT =   '<div class="graderreportoverlay {{overridden}}" role="tooltip" aria-describedby="{{id}}">' +
                    '<div class="fullname">{{username}}</div><div class="itemname">{{itemname}}</div>' +
                    '{{#if feedback}}' +
                        '<div class="feedback">{{feedback}}</div>' +
                    '{{/if}}' +
                '</div>';

Tooltip.prototype = {
    /**
     * A reference to the tooltip. A single tooltip is lazily instantiated
     * and then reused.
     *
     * @property _tooltip
     * @type Overlay
     * @protected
     */
    _tooltip: null,

    /**
     * A reference to the boundingBox of the tooltip. This is used as an
     * optimisation in the hideTooltip test.
     *
     * @property _tooltipBoundingBox
     * @type Node
     * @protected
     */
    _tooltipBoundingBox: null,

    /**
     * The compiled template for the tooltip content.
     * This is setup the first time that {{#crossLink "_getTooltip"}}{{/crossLink}} is called.
     *
     * @property _tooltipTemplate
     * @type Function
     * @default null
     * @protected
     */
    _tooltipTemplate: null,

    /**
     * Setup the tooltip.
     *
     * @method setupTooltips
     * @chainable
     */
    setupTooltips: function() {
        this._eventHandles.push(
            this.graderTable.delegate('hover', this._showTooltip, this._hideTooltip, SELECTORS.GRADECELL, this),
            this.graderTable.delegate('click', this._toggleTooltip, SELECTORS.GRADECELL, this)
        );

        return this;
    },

    /**
     * Prepare and retrieve the tooltip.
     *
     * @method _getTooltip
     * @return Overlay
     * @protected
     */
    _getTooltip: function() {
        if (!this._tooltip) {
            this._tooltip = new Y.Overlay({
                visible: false,
                render: Y.one(SELECTORS.GRADEPARENT)
            });
            this._tooltipBoundingBox = this._tooltip.get('boundingBox');
            this._tooltipTemplate = Y.Handlebars.compile(CONTENT);
            this._tooltipBoundingBox.addClass('grader-information-tooltip');
        }
        return this._tooltip;
    },

    /**
     * Display the tooltip.
     *
     * @method _showTooltip
     * @param {EventFacade} e
     * @protected
     */
    _showTooltip: function(e) {
        var cell = e.currentTarget;

        var tooltip = this._getTooltip();

        tooltip.set('bodyContent', this._tooltipTemplate({
                    cellid: cell.get('id'),
                    username: this.getGradeUserName(cell),
                    itemname: this.getGradeItemName(cell),
                    feedback: this.getGradeFeedback(cell),
                    overridden: cell.hasClass(CSS.OVERRIDDEN) ? CSS.OVERRIDDEN : ''
                }))
                .set('xy', [
                    cell.getX() + (cell.get('offsetWidth') / 2),
                    cell.getY() + (cell.get('offsetHeight') / 2)
                ])
                .show();
        e.currentTarget.addClass(CSS.TOOLTIPACTIVE);
    },

    /**
     * Hide the tooltip.
     *
     * @method _hideTooltip
     * @param {EventFacade} e
     * @protected
     */
    _hideTooltip: function(e) {
        if (e.relatedTarget && this._tooltipBoundingBox && this._tooltipBoundingBox.contains(e.relatedTarget)) {
            // Do not exit if the user is mousing over the tooltip itself.
            return;
        }
        if (this._tooltip) {
            e.currentTarget.removeClass(CSS.TOOLTIPACTIVE);
            this._tooltip.hide();
        }
    },

    /**
     * Toggle the tooltip between visible and hidden.
     *
     * @method _toggleTooltip
     * @param {EventFacade} e
     * @protected
     */
    _toggleTooltip: function(e) {
        if (e.currentTarget.hasClass(CSS.TOOLTIPACTIVE)) {
            this._hideTooltip(e);
        } else {
            this._showTooltip(e);
        }
    }
};

Y.Base.mix(Y.M.gradereport_grader.ReportTable, [Tooltip]);


}, '@VERSION@', {"requires": ["base", "node", "event", "handlebars", "overlay", "event-hover", "node-event-simulate"]});
