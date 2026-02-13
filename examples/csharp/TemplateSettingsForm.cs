using System;
using System.Collections.Generic;
using System.Windows.Forms;

namespace SignatureGenerator.Examples
{
    public partial class TemplateSettingsForm : Form
    {
        private readonly List<string> _templateNames = new List<string>
        {
            "Default",
            "Compact",
            "Sales"
        };

        public TemplateSettingsForm()
        {
            InitializeComponent();
            lstTemplates.DataSource = _templateNames;
        }

        private void lstTemplates_SelectedIndexChanged(object sender, EventArgs e)
        {
            txtTemplateName.Text = lstTemplates.SelectedItem?.ToString() ?? string.Empty;

            chkIncludePhone.Checked = txtTemplateName.Text != "Compact";
            chkIncludeWebsite.Checked = true;
        }

        private void btnSave_Click(object sender, EventArgs e)
        {
            if (string.IsNullOrWhiteSpace(txtTemplateName.Text))
            {
                MessageBox.Show("Template name is required.", "Validation", MessageBoxButtons.OK, MessageBoxIcon.Warning);
                return;
            }

            MessageBox.Show("Template settings saved (example).", "Saved", MessageBoxButtons.OK, MessageBoxIcon.Information);
        }

        private void btnClose_Click(object sender, EventArgs e)
        {
            Close();
        }
    }
}
