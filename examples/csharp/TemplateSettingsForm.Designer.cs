using System.ComponentModel;
using System.Windows.Forms;

namespace SignatureGenerator.Examples
{
    partial class TemplateSettingsForm
    {
        private IContainer components = null;
        private ListBox lstTemplates;
        private Label lblTemplateName;
        private TextBox txtTemplateName;
        private CheckBox chkIncludePhone;
        private CheckBox chkIncludeWebsite;
        private Button btnSave;
        private Button btnClose;

        protected override void Dispose(bool disposing)
        {
            if (disposing && (components != null))
            {
                components.Dispose();
            }

            base.Dispose(disposing);
        }

        private void InitializeComponent()
        {
            this.lstTemplates = new System.Windows.Forms.ListBox();
            this.lblTemplateName = new System.Windows.Forms.Label();
            this.txtTemplateName = new System.Windows.Forms.TextBox();
            this.chkIncludePhone = new System.Windows.Forms.CheckBox();
            this.chkIncludeWebsite = new System.Windows.Forms.CheckBox();
            this.btnSave = new System.Windows.Forms.Button();
            this.btnClose = new System.Windows.Forms.Button();
            this.SuspendLayout();
            // 
            // lstTemplates
            // 
            this.lstTemplates.FormattingEnabled = true;
            this.lstTemplates.ItemHeight = 15;
            this.lstTemplates.Location = new System.Drawing.Point(12, 12);
            this.lstTemplates.Name = "lstTemplates";
            this.lstTemplates.Size = new System.Drawing.Size(208, 214);
            this.lstTemplates.TabIndex = 0;
            this.lstTemplates.SelectedIndexChanged += new System.EventHandler(this.lstTemplates_SelectedIndexChanged);
            // 
            // lblTemplateName
            // 
            this.lblTemplateName.AutoSize = true;
            this.lblTemplateName.Location = new System.Drawing.Point(237, 15);
            this.lblTemplateName.Name = "lblTemplateName";
            this.lblTemplateName.Size = new System.Drawing.Size(90, 15);
            this.lblTemplateName.TabIndex = 1;
            this.lblTemplateName.Text = "Template name";
            // 
            // txtTemplateName
            // 
            this.txtTemplateName.Location = new System.Drawing.Point(237, 33);
            this.txtTemplateName.Name = "txtTemplateName";
            this.txtTemplateName.Size = new System.Drawing.Size(216, 23);
            this.txtTemplateName.TabIndex = 2;
            // 
            // chkIncludePhone
            // 
            this.chkIncludePhone.AutoSize = true;
            this.chkIncludePhone.Location = new System.Drawing.Point(237, 76);
            this.chkIncludePhone.Name = "chkIncludePhone";
            this.chkIncludePhone.Size = new System.Drawing.Size(99, 19);
            this.chkIncludePhone.TabIndex = 3;
            this.chkIncludePhone.Text = "Include phone";
            this.chkIncludePhone.UseVisualStyleBackColor = true;
            // 
            // chkIncludeWebsite
            // 
            this.chkIncludeWebsite.AutoSize = true;
            this.chkIncludeWebsite.Location = new System.Drawing.Point(237, 101);
            this.chkIncludeWebsite.Name = "chkIncludeWebsite";
            this.chkIncludeWebsite.Size = new System.Drawing.Size(107, 19);
            this.chkIncludeWebsite.TabIndex = 4;
            this.chkIncludeWebsite.Text = "Include website";
            this.chkIncludeWebsite.UseVisualStyleBackColor = true;
            // 
            // btnSave
            // 
            this.btnSave.Location = new System.Drawing.Point(237, 203);
            this.btnSave.Name = "btnSave";
            this.btnSave.Size = new System.Drawing.Size(102, 23);
            this.btnSave.TabIndex = 5;
            this.btnSave.Text = "Save";
            this.btnSave.UseVisualStyleBackColor = true;
            this.btnSave.Click += new System.EventHandler(this.btnSave_Click);
            // 
            // btnClose
            // 
            this.btnClose.Location = new System.Drawing.Point(351, 203);
            this.btnClose.Name = "btnClose";
            this.btnClose.Size = new System.Drawing.Size(102, 23);
            this.btnClose.TabIndex = 6;
            this.btnClose.Text = "Close";
            this.btnClose.UseVisualStyleBackColor = true;
            this.btnClose.Click += new System.EventHandler(this.btnClose_Click);
            // 
            // TemplateSettingsForm
            // 
            this.AutoScaleDimensions = new System.Drawing.SizeF(7F, 15F);
            this.AutoScaleMode = System.Windows.Forms.AutoScaleMode.Font;
            this.ClientSize = new System.Drawing.Size(467, 239);
            this.Controls.Add(this.btnClose);
            this.Controls.Add(this.btnSave);
            this.Controls.Add(this.chkIncludeWebsite);
            this.Controls.Add(this.chkIncludePhone);
            this.Controls.Add(this.txtTemplateName);
            this.Controls.Add(this.lblTemplateName);
            this.Controls.Add(this.lstTemplates);
            this.FormBorderStyle = System.Windows.Forms.FormBorderStyle.FixedDialog;
            this.MaximizeBox = false;
            this.Name = "TemplateSettingsForm";
            this.StartPosition = System.Windows.Forms.FormStartPosition.CenterParent;
            this.Text = "Template Settings";
            this.ResumeLayout(false);
            this.PerformLayout();
        }
    }
}
