using System;
using System.Windows.Forms;

namespace SignatureGenerator.Examples
{
    public partial class SignatureGeneratorForm : Form
    {
        public SignatureGeneratorForm()
        {
            InitializeComponent();
        }

        private void btnGenerate_Click(object sender, EventArgs e)
        {
            txtPreview.Text =
                $"{txtName.Text}\r\n" +
                $"{txtTitle.Text}\r\n" +
                "Acme Systems\r\n" +
                $"Email: {txtEmail.Text}";
        }

        private void btnCopy_Click(object sender, EventArgs e)
        {
            if (!string.IsNullOrWhiteSpace(txtPreview.Text))
            {
                Clipboard.SetText(txtPreview.Text);
            }
        }
    }
}
