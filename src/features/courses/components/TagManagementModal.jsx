import { useState } from "react";
import Icon from "../../../components/icons/Icon";
import styles from "../Courses.module.css";
import { useTagsManager } from "../hooks/useTagsManager";

const TagManagementModal = ({ isOpen, onClose }) => {
  const [newTagName, setNewTagName] = useState("");
  const { tags, isLoading, isSubmitting, error, addTag, removeTag } =
    useTagsManager();

  if (!isOpen) return null;

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!newTagName.trim()) return;

    const success = await addTag(newTagName);
    if (success) setNewTagName("");
  };

  return (
    <div
      className={styles.modalOverlay}
      onClick={() => !isSubmitting && onClose()}
    >
      <div
        className={styles.tagModalContent}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className={styles.tagModalHeader}>
          <div className={styles.headerTitleArea}>
            <div className={styles.iconBoxPrimary}>
              <Icon name="tag" size={24} />
            </div>
            <div>
              <h3>Manage Platform Tags</h3>
              <p>Add or remove global tags used across all workspaces.</p>
            </div>
          </div>
          <button
            className={styles.closeBtn}
            onClick={onClose}
            disabled={isSubmitting}
          >
            <Icon name="close" size={20} />
          </button>
        </div>

        <div className={styles.tagModalBody}>
          {error && <div className={styles.errorMessage}>{error}</div>}

          {/* Form to Add Tag */}
          <form className={styles.addTagForm} onSubmit={handleAdd}>
            <div className={styles.inputWrapper}>
              <div className={styles.inputIcon}>
                <Icon name="tag" size={18} />
              </div>
              <input
                type="text"
                placeholder="Enter new tag name (e.g. React, UI/UX)..."
                value={newTagName}
                onChange={(e) => setNewTagName(e.target.value)}
                disabled={isSubmitting}
                autoFocus
              />
            </div>
            <button
              type="submit"
              className={styles.addTagBtn}
              disabled={isSubmitting || !newTagName.trim()}
            >
              <Icon name="plus" size={18} />
              {isSubmitting ? "Adding..." : "Add Tag"}
            </button>
          </form>

          {/* Tags List */}
          <div className={styles.tagsAreaContainer}>
            <span className={styles.tagsAreaLabel}>
              Active Global Tags ({tags.length})
            </span>

            {isLoading ? (
              <div className={styles.loadingState}>Loading tags...</div>
            ) : tags.length === 0 ? (
              <div className={styles.emptyState}>No tags created yet.</div>
            ) : (
              <div className={styles.tagsGrid}>
                {tags.map((tag) => (
                  <div key={tag.id} className={styles.tagItem}>
                    <span className={styles.tagName}>{tag.name}</span>
                    <button
                      className={styles.deleteTagBtn}
                      onClick={() => removeTag(tag.id)}
                      disabled={isSubmitting}
                      title={`Delete ${tag.name}`}
                    >
                      <Icon name="trash" size={16} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TagManagementModal;
