<?php
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
 * Class for loading/storing evidence of prior learning.
 *
 * @package    tool_lp
 * @copyright  2015 Simey Lameze <lameze@gmail.com>
 * @license    http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */
namespace tool_lp;

use stdClass;

/**
 * Class for loading/storing evidence of prior learning from the DB.
 *
 * @copyright  2015 Simey Lameze <lameze@gmail.com>
 * @license    http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */
class evidence extends persistent {

    /** Proposed evidence status */
    const STATUS_EVIDENCE_CREATED = 0;
    const STATUS_EVIDENCE_SUBMITTED = 1;
    const STATUS_EVIDENCE_REVIEWING = 2;
    const STATUS_EVIDENCE_DENIED = 3;
    const STATUS_EVIDENCE_APPROVED = 4;

    /** @var string $name Name for this evidence */
    private $name = '';

    /** @var string $description Description for this evidence */
    private $description = '';

    /** @var int $evidencetypeid Type of the evidence */
    private $evidencetypeid = 0;

    /** @var string $link Link of the evidence */
    private $link = '';

    /** @var int $datecompleted Evidence completion date */
    private $datecompleted = 0;

    /** @var string $fileattachments file attachments of the evidence */
    private $fileattachments = '';

    /** @var bool $status The evidence status, one of the 5 \tool_lp\plan:STATUS_EVIDENCE_* constants */
    private $status = 0;

    /** @var int $timecreated Time of evidence creation */
    private $timecreated = 0;

    /** @var int $timemodified Evidence last modified date  */
    private $timemodified = 0;

    /** @var int $userid The user that has submitted the evidence */
    private $userid = 0;

    /** @var int $approvaluserid The user that has approved the evidence */
    private $approvaluserid = 0;

    /**
     * Method that provides the table name matching this class.
     *
     * @return string
     */
    public function get_table_name() {
        return 'lp_evidence';
    }

    /**
     * Get the evidence name.
     *
     * @return string The name
     */
    public function get_name() {
        return $this->name;
    }

    /**
     * Set the evidence name.
     *
     * @param string $name The evidence name
     */
    public function set_name($name) {
        $this->name = $name;
    }

    /**
     * Get the evidence description.
     *
     * @return string The evidence description
     */
    public function get_description() {
        return $this->description;
    }

    /**
     * Set the evidence description.
     *
     * @param string $description The evidence description.
     */
    public function set_description($description) {
        $this->description = $description;
    }

    /**
     * Get the evidence type id.
     *
     * @return int The evidence type id.
     */
    public function get_evidencetypeid() {
        return $this->evidencetypeid;
    }

    /**
     * Set the evidence type id.
     *
     * @param int $evidencetypeid The evidence type id.
     */
    public function set_evidencetypeid($evidencetypeid) {
        $this->evidencetypeid = $evidencetypeid;
    }

    /**
     * Get the evidence link.
     *
     * @return string The evidence link.
     */
    public function get_link() {
        return $this->link;
    }

    /**
     * Set the evidence link.
     *
     * @param string $link The evidence link.
     */
    public function set_link($link) {
        $this->link = $link;
    }

    /**
     * Get the evidence completion date.
     *
     * @return int The evidence completion date.
     */
    public function get_datecompleted() {
        return $this->datecompleted;
    }

    /**
     * Set the evidence completion date.
     *
     * @param int $datecompleted The evidence completed date.
     */
    public function set_datecompleted($datecompleted) {
        $this->datecompleted = $datecompleted;
    }

    /**
     * Get the file attachments.
     *
     * @return string The file attachments.
     */
    public function get_fileattachments() {
        return $this->fileattachments;
    }

    /**
     * Set the file attachments.
     *
     * @param string $fileattachments The file attachments.
     */
    public function set_fileattachments($fileattachments) {
        $this->fileattachments = $fileattachments;
    }

    /**
     * Get the status.
     *
     * @return int The evidence status.
     */
    public function get_status() {
        return $this->status;
    }

    /**
     * Set the status.
     *
     * @param int $status The evidence status.
     */
    public function set_status($status) {
        $this->status = $status;
    }

    /**
     * Get the time created.
     *
     * @return int The time created.
     */
    public function get_timecreated() {
        return $this->timecreated;
    }

    /**
     * Set the time created.
     *
     * @param int $timecreated The time created.
     */
    public function set_timecreated($timecreated) {
        $this->timecreated = $timecreated;
    }

    /**
     * Get the time modified.
     *
     * @return int $timemodified The time modified.
     */
    public function get_timemodified() {
        return $this->timemodified;
    }

    /**
     * Set the time modified.
     *
     * @param int $timemodified The time modified.
     */
    public function set_timemodified($timemodified) {
        $this->timemodified = $timemodified;
    }

    /**
     * Get the user id.
     *
     * @return int $userid The user id.
     */
     public function get_userid() {
         return $this->userid;
     }

    /**
     * Set the user id.
     *
     * @param int $userid The user id.
     */
    public function set_userid($userid) {
        $this->userid = $userid;
    }

    /**
     * Get the user id from the user who have approved the evidence.
     *
     * @return int $approvaluserid The user id.
     */
    public function get_approvaluserid() {
        return $this->approvaluserid;
    }

    /**
     * Set the user id from the user who have approved the evidence.
     *
     * @param int $approvaluserid The user id.
     */
    public function set_approvaluserid($approvaluserid) {
        $this->approvaluserid = $approvaluserid;
    }
    /**
     * Populate this class with data from a DB record.
     *
     * @param stdClass $record A DB record.
     * @return template
     */
    public function from_record($record) {
        if (isset($record->id)) {
            $this->set_id($record->id);
        }
        if (isset($record->name)) {
            $this->set_name($record->name);
        }
        if (isset($record->description)) {
            $this->set_description($record->description);
        }
        if (isset($record->evidencetypeid)) {
            $this->set_evidencetypeid($record->evidencetypeid);
        }
        if (isset($record->link)) {
            $this->set_link($record->link);
        }
        if (isset($record->datecompleted)) {
            $this->set_datecompleted($record->datecompleted);
        }
        if (isset($record->fileattachments)) {
            $this->set_fileattachments($record->fileattachments);
        }
        if (isset($record->status)) {
            $this->set_status($record->status);
        }
        if (isset($record->timecreated)) {
            $this->set_timecreated($record->timecreated);
        }
        if (isset($record->timemodified)) {
            $this->set_timemodified($record->timemodified);
        }
        if (isset($record->userid)) {
            $this->set_userid($record->userid);
        }
        if (isset($record->approvaluserid)) {
            $this->set_approvaluserid($record->approvaluserid);
        }

        return $this;
    }

    /**
     * Create a DB record from this class.
     *
     * @return stdClass The evidence object.
     */
    public function to_record() {
        $record = new stdClass();
        $record->id = $this->get_id();
        $record->name = $this->get_name();
        $record->description = $this->get_description();
        $record->evidencetypeid = $this->get_evidencetypeid();
        $record->link = $this->get_link();
        $record->datecompleted = '';
        if ($record->datecompleted) {
            $record->datecompleted = userdate($this->get_datecompleted());
        }
        $record->fileattachments = $this->get_fileattachments();
        $record->status = $this->get_status();
        $record->timecreated = $this->get_timecreated();
        $record->timemodified = $this->get_timemodified();
        $record->userid = $this->get_userid();
        $record->approvaluserid = $this->get_approvaluserid();

        return $record;
    }

    /**
     * Add a default for the sortorder field to the default create logic.
     *
     * @return persistent
     */
    public function create() {
        $this->sortorder = $this->count_records();
        return parent::create();
    }


}
