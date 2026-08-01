package com.example.ui;
import java.awt.BorderLayout;
import java.awt.Color;
import java.awt.Dimension;
import java.awt.FlowLayout;
import java.awt.Font;
import java.awt.GridBagLayout;
import java.awt.GridLayout;
import java.text.SimpleDateFormat;
import java.util.Date;

import javax.swing.BorderFactory;
import javax.swing.Box;
import javax.swing.BoxLayout;
import javax.swing.JButton;
import javax.swing.JFrame;
import javax.swing.JLabel;
import javax.swing.JOptionPane;
import javax.swing.JPanel;
import javax.swing.JScrollPane;
import javax.swing.JTable;
import javax.swing.JTextField;
import javax.swing.SwingConstants;
import javax.swing.SwingUtilities;
import javax.swing.Timer;
import javax.swing.border.EmptyBorder;
import javax.swing.table.DefaultTableModel;
public class MainDashboard extends JFrame {

    // =========================
    // UI COMPONENTS
    // =========================

    private JTextField taskField;

    private JButton startButton;
    private JButton stopButton;

    private JLabel timerLabel;
    private JLabel currentTaskLabel;

    private JLabel totalTimeLabel;
    private JLabel tasksCompletedLabel;

    private JTable taskTable;
    private DefaultTableModel tableModel;

    // =========================
    // TIMER VARIABLES
    // =========================

    private Timer timer;

    private int elapsedSeconds = 0;

    private String currentTask = "";

    // =========================
    // CONSTRUCTOR
    // =========================

    public MainDashboard() {

        initializeFrame();

        initializeComponents();

        createLayout();

        initializeTimer();

        setVisible(true);
    }

    // =========================
    // FRAME CONFIGURATION
    // =========================

    private void initializeFrame() {

        setTitle("Time Tracker Dashboard");

        setSize(1000, 700);

        setLocationRelativeTo(null);

        setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE);

        setLayout(new BorderLayout());

        getContentPane().setBackground(new Color(30, 30, 30));
    }

    // =========================
    // INITIALIZE COMPONENTS
    // =========================

    private void initializeComponents() {

        // =========================
        // TASK INPUT
        // =========================

        taskField = new JTextField();

        taskField.setFont(new Font("SansSerif", Font.PLAIN, 16));

        taskField.setPreferredSize(new Dimension(300, 40));

        // =========================
        // BUTTONS
        // =========================

        startButton = createStyledButton("Start");

        stopButton = createStyledButton("Stop");

        // =========================
        // TIMER LABEL
        // =========================

        timerLabel = new JLabel("00:00:00");

        timerLabel.setFont(new Font("SansSerif", Font.BOLD, 48));

        timerLabel.setForeground(Color.WHITE);

        timerLabel.setHorizontalAlignment(SwingConstants.CENTER);

        // =========================
        // CURRENT TASK LABEL
        // =========================

        currentTaskLabel = new JLabel("No Active Task");

        currentTaskLabel.setFont(new Font("SansSerif", Font.PLAIN, 18));

        currentTaskLabel.setForeground(Color.LIGHT_GRAY);

        currentTaskLabel.setHorizontalAlignment(SwingConstants.CENTER);

        // =========================
        // SUMMARY LABELS
        // =========================

        totalTimeLabel = new JLabel("Total Time Today: 0h 0m");

        totalTimeLabel.setForeground(Color.WHITE);

        totalTimeLabel.setFont(new Font("SansSerif", Font.BOLD, 16));

        tasksCompletedLabel = new JLabel("Tasks Completed: 0");

        tasksCompletedLabel.setForeground(Color.WHITE);

        tasksCompletedLabel.setFont(new Font("SansSerif", Font.BOLD, 16));

        // =========================
        // TABLE
        // =========================

        String[] columns = {
                "Task",
                "Start Time",
                "End Time",
                "Duration"
        };

        tableModel = new DefaultTableModel(columns, 0);

        taskTable = new JTable(tableModel);

        taskTable.setRowHeight(30);

        taskTable.setFont(new Font("SansSerif", Font.PLAIN, 14));

        taskTable.getTableHeader().setFont(
                new Font("SansSerif", Font.BOLD, 14)
        );

        taskTable.setBackground(new Color(45, 45, 48));

        taskTable.setForeground(Color.WHITE);

        taskTable.getTableHeader().setBackground(new Color(60, 60, 60));

        taskTable.getTableHeader().setForeground(Color.WHITE);

        // =========================
        // BUTTON ACTIONS
        // =========================

        startButton.addActionListener(e -> startTask());

        stopButton.addActionListener(e -> stopTask());
    }

    // =========================
    // MAIN LAYOUT
    // =========================

    private void createLayout() {

        // =========================
        // TOP PANEL
        // =========================

        JPanel topPanel = new JPanel();

        topPanel.setLayout(new FlowLayout(FlowLayout.LEFT, 15, 15));

        topPanel.setBackground(new Color(45, 45, 48));

        topPanel.setBorder(new EmptyBorder(10, 10, 10, 10));

        JLabel taskLabel = new JLabel("Task:");

        taskLabel.setForeground(Color.WHITE);

        taskLabel.setFont(new Font("SansSerif", Font.BOLD, 16));

        topPanel.add(taskLabel);

        topPanel.add(taskField);

        topPanel.add(startButton);

        topPanel.add(stopButton);

        // =========================
        // CENTER PANEL
        // =========================

        JPanel centerPanel = new JPanel();

        centerPanel.setLayout(new BoxLayout(centerPanel, BoxLayout.Y_AXIS));

        centerPanel.setBackground(new Color(30, 30, 30));

        centerPanel.setBorder(new EmptyBorder(40, 20, 40, 20));

        centerPanel.add(timerLabel);

        centerPanel.add(Box.createVerticalStrut(15));

        centerPanel.add(currentTaskLabel);

        // =========================
        // SUMMARY PANEL
        // =========================

        JPanel summaryPanel = new JPanel();

        summaryPanel.setLayout(new GridLayout(1, 2, 20, 20));

        summaryPanel.setBackground(new Color(30, 30, 30));

        summaryPanel.setBorder(new EmptyBorder(10, 20, 10, 20));

        JPanel totalTimeCard = createSummaryCard(totalTimeLabel);

        JPanel tasksCard = createSummaryCard(tasksCompletedLabel);

        summaryPanel.add(totalTimeCard);

        summaryPanel.add(tasksCard);

        // =========================
        // TABLE PANEL
        // =========================

        JScrollPane scrollPane = new JScrollPane(taskTable);

        scrollPane.setBorder(
                BorderFactory.createTitledBorder(
                        BorderFactory.createLineBorder(Color.GRAY),
                        "Task History",
                        0,
                        0,
                        new Font("SansSerif", Font.BOLD, 16),
                        Color.WHITE
                )
        );

        scrollPane.getViewport().setBackground(new Color(45, 45, 48));

        // =========================
        // BOTTOM PANEL
        // =========================

        JPanel bottomPanel = new JPanel(new BorderLayout());

        bottomPanel.setBackground(new Color(30, 30, 30));

        bottomPanel.add(summaryPanel, BorderLayout.NORTH);

        bottomPanel.add(scrollPane, BorderLayout.CENTER);

        // =========================
        // ADD TO FRAME
        // =========================

        add(topPanel, BorderLayout.NORTH);

        add(centerPanel, BorderLayout.CENTER);

        add(bottomPanel, BorderLayout.SOUTH);
    }

    // =========================
    // TIMER INITIALIZATION
    // =========================

    private void initializeTimer() {

        timer = new Timer(1000, e -> {

            elapsedSeconds++;

            int hours = elapsedSeconds / 3600;

            int minutes = (elapsedSeconds % 3600) / 60;

            int seconds = elapsedSeconds % 60;

            String time = String.format(
                    "%02d:%02d:%02d",
                    hours,
                    minutes,
                    seconds
            );

            timerLabel.setText(time);
        });
    }

    // =========================
    // START TASK
    // =========================

    private void startTask() {

        currentTask = taskField.getText().trim();

        if (currentTask.isEmpty()) {

            JOptionPane.showMessageDialog(
                    this,
                    "Please enter task name"
            );

            return;
        }

        elapsedSeconds = 0;

        timerLabel.setText("00:00:00");

        currentTaskLabel.setText("Current Task: " + currentTask);

        timer.start();
    }

    // =========================
    // STOP TASK
    // =========================

    private void stopTask() {

        if (!timer.isRunning()) {
            return;
        }

        timer.stop();

        String duration = timerLabel.getText();

        String startTime = new SimpleDateFormat(
                "HH:mm:ss"
        ).format(new Date());

        String endTime = new SimpleDateFormat(
                "HH:mm:ss"
        ).format(new Date());

        tableModel.addRow(new Object[]{
                currentTask,
                startTime,
                endTime,
                duration
        });

        updateSummary();

        currentTaskLabel.setText("No Active Task");

        taskField.setText("");
    }

    // =========================
    // UPDATE SUMMARY
    // =========================

    private void updateSummary() {

        int totalTasks = tableModel.getRowCount();

        tasksCompletedLabel.setText(
                "Tasks Completed: " + totalTasks
        );

        int totalMinutes = elapsedSeconds / 60;

        int hours = totalMinutes / 60;

        int minutes = totalMinutes % 60;

        totalTimeLabel.setText(
                "Total Time Today: " +
                        hours + "h " +
                        minutes + "m"
        );
    }

    // =========================
    // CREATE BUTTON
    // =========================

    private JButton createStyledButton(String text) {

        JButton button = new JButton(text);

        button.setFocusPainted(false);

        button.setBackground(new Color(76, 175, 80));

        button.setForeground(Color.WHITE);

        button.setFont(new Font("SansSerif", Font.BOLD, 15));

        button.setPreferredSize(new Dimension(100, 40));

        return button;
    }

    // =========================
    // SUMMARY CARD
    // =========================

    private JPanel createSummaryCard(JLabel label) {

        JPanel panel = new JPanel(new GridBagLayout());

        panel.setBackground(new Color(45, 45, 48));

        panel.setBorder(new EmptyBorder(20, 20, 20, 20));

        panel.add(label);

        return panel;
    }

    // =========================
    // MAIN METHOD
    // =========================

    public static void main(String[] args) {

        SwingUtilities.invokeLater(MainDashboard::new);
    }
}
